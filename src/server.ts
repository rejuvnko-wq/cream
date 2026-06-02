import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import fs from 'node:fs/promises';
import nodemailer from 'nodemailer';
import 'dotenv/config';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
app.use(express.json());

const angularApp = new AngularNodeAppEngine();

/**
 * REST API Endpoint to add an email to the waitlist and send a confirmation email.
 */
app.post('/api/waitlist', async (req, res) => {
  try {
    const { email, quantity } = req.body;

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({ error: 'Valid email address is required.' });
      return;
    }

    const qty = parseInt(quantity, 10) || 1;
    const normalizedEmail = email.trim().toLowerCase();
    const entry = {
      email: normalizedEmail,
      quantity: qty,
      date: new Date().toISOString()
    };

    // 1. CHECK FOR DUPLICATES FIRST
    const isDuplicate = await isEmailAlreadyRegistered(normalizedEmail);
    if (isDuplicate) {
      res.status(409).json({ error: 'already_registered', message: 'This email is already on the waitlist.' });
      return;
    }

    // 2. SAVE TO DATABASE (Supabase API or fallback to local JSON file)
    const supabaseUrl = process.env['SUPABASE_URL'];
    const supabaseKey = process.env['SUPABASE_KEY'];

    if (supabaseUrl && supabaseKey) {
      try {
        const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/waitlist`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(entry)
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error('Supabase save error:', errText);
          throw new Error('Database save failed');
        }
        console.log(`Saved entry to Supabase for: ${normalizedEmail}`);
      } catch (dbErr) {
        console.error('Failed to save to Supabase database, falling back to local file...', dbErr);
        await saveToLocalFile(entry);
      }
    } else {
      console.log('No Supabase credentials. Saving waitlist entry to local JSON file...');
      await saveToLocalFile(entry);
    }

    // 2. SEND CONFIRMATION EMAIL (Nodemailer or fallback to console simulation)
    const smtpHost = process.env['SMTP_HOST'];
    const smtpUser = process.env['SMTP_USER'];
    const smtpPass = process.env['SMTP_PASS'];

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(process.env['SMTP_PORT'] || '587', 10),
          secure: process.env['SMTP_SECURE'] === 'true',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: process.env['EMAIL_FROM'] || `"REJUVN Team" <${smtpUser}>`,
          to: normalizedEmail,
          subject: 'You are on the REJUVN waitlist!',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: rgb(229, 214, 197); font-size: 24px; text-transform: uppercase; margin-bottom: 20px;">REJUVN Waitlist</h2>
              <p>Hi there,</p>
              <p>Thank you for your interest! We've successfully added you to our product waitlist.</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f9f9f9; border-radius: 5px;">
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px; font-weight: bold;">Email:</td>
                  <td style="padding: 10px;">${normalizedEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: bold;">Reserved Quantity:</td>
                  <td style="padding: 10px;">${qty}</td>
                </tr>
              </table>
              <p>We will notify you as soon as the product is back in stock.</p>
              <p style="margin-top: 40px; font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} REJUVN. All rights reserved.</p>
            </div>
          `
        });
        console.log(`Confirmation email sent to ${normalizedEmail}`);
      } catch (mailErr) {
        console.error('Nodemailer error sending email:', mailErr);
      }
    } else {
      console.log(`[Email Simulation - No Credentials]
To: ${normalizedEmail}
Subject: You are on the REJUVN waitlist!
Body: Successfully waitlisted for quantity: ${qty}
--------------------------------------------------`);
    }

    res.status(200).json({ success: true, message: 'Successfully added to the waitlist.' });
  } catch (err: any) {
    console.error('Waitlist API error:', err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

app.get('/api/waitlist/count', async (req, res) => {
  try {
    const supabaseUrl = process.env['SUPABASE_URL'];
    const supabaseKey = process.env['SUPABASE_KEY'];
    let dbCount = 0;

    if (supabaseUrl && supabaseKey) {
      try {
        const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/waitlist?select=count`, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'count=exact'
          }
        });
        if (response.ok) {
          const rangeHeader = response.headers.get('content-range');
          if (rangeHeader) {
            const match = rangeHeader.match(/\/(\d+)/);
            if (match) {
              dbCount = parseInt(match[1], 10);
            }
          }
        }
      } catch (dbErr) {
        console.error('Failed to get count from Supabase, checking local file...', dbErr);
      }
    }

    const localCount = await getLocalCount();
    // Base waitlist number of 0 + actual entries
    const count = dbCount + localCount;
    res.status(200).json({ count });
  } catch (err) {
    res.status(200).json({ count: 0 });
  }
});

async function isEmailAlreadyRegistered(email: string): Promise<boolean> {
  try {
    const filePath = join(process.cwd(), 'waitlist.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const waitlist = JSON.parse(data) as { email: string }[];
    return waitlist.some(item => item.email === email);
  } catch {
    return false;
  }
}

async function getLocalCount(): Promise<number> {
  try {
    const filePath = join(process.cwd(), 'waitlist.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const waitlist = JSON.parse(data);
    return Array.isArray(waitlist) ? waitlist.length : 0;
  } catch {
    return 0;
  }
}

async function saveToLocalFile(entry: { email: string; quantity: number; date: string }) {
  const filePath = join(process.cwd(), 'waitlist.json');
  let waitlist: any[] = [];
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    waitlist = JSON.parse(data);
  } catch (e) {
    // File doesn't exist yet, start with empty list
  }

  // Check if email already exists in local list to avoid duplicates
  if (!waitlist.some(item => item.email === entry.email)) {
    waitlist.push(entry);
    await fs.writeFile(filePath, JSON.stringify(waitlist, null, 2), 'utf-8');
  }
}


/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
