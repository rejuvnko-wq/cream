import { Component, inject, OnInit, AfterViewInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RejuvnStoreService } from '../../shared/rejuvn-store.service';

type CollectionCard = {
  title: string;
  accent: string;
  copy: string;
};

type IngredientCard = {
  title: string;
  copy: string;
};

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  private readonly title = inject(Title);
  private readonly store = inject(RejuvnStoreService);
  private readonly platformId = inject(PLATFORM_ID);

  // Modal State
  isModalOpen = false;

  // Mobile Nav State
  isMobileMenuOpen = false;

  // Waitlist State
  email = '';
  emailTouched = false;
  showSuccess = false;
  quantity = 1;
  isSubmitting = false;
  alreadyRegistered = signal(false);
  waitlistCount = signal(0);

  readonly principles = ['Barrier repair', 'Enhanced elasticity', 'Anti-aging', 'Fast-absorbing', 'Non-greasy', 'Sensitive skin friendly'];

  readonly collections: CollectionCard[] = [
    {
      title: 'Serums',
      accent: 'Brightening',
      copy: 'Lightweight formulas that slip into a simple routine.'
    },
    {
      title: 'Masks',
      accent: 'Reset',
      copy: 'Weekly treatments for when skin needs a calm restart.'
    },
    {
      title: 'Toners',
      accent: 'Prep',
      copy: 'Watery layers that help skin feel fresh and balanced.'
    },
    {
      title: 'Sun Care',
      accent: 'Protect',
      copy: 'Daily protection with a soft, comfortable finish.'
    }
  ];

  readonly ingredients: IngredientCard[] = [
    {
      title: 'PDRN',
      copy: 'A biological molecule that triggers cell regeneration and collagen synthesis.'
    },
    {
      title: 'Acido ialuronico',
      copy: 'Provides deep hydration, locks in moisture, and enhances barrier function.'
    },
    {
      title: 'Niacinamide',
      copy: 'A powerful multitasker that enhances elasticity, brightens tone, and reduces fine lines.'
    }
  ];

  readonly featuredSpecs = [
    { key: 'Texture', value: 'Light, fast-absorbing & non-greasy' },
    { key: 'Skin Type', value: 'Sensitive friendly' },
    { key: 'Format', value: '30 ml' },
    { key: 'Use', value: 'Daily (AM / PM)' }
  ];

  readonly benefits = [
    { num: '01', symbol: '◆', title: 'Rigenerazione Profonda', desc: 'Attiva i meccanismi endogeni di riparazione del DNA cellulare, favorendo la rinnovazione accelerata degli strati dermici.' },
    { num: '02', symbol: '◈', title: 'Anti-Aging Attivo', desc: 'Riduce le rughe fini e i segni del tempo aumentando la sintesi di collagene tipo I e elastina fino al 340%.' },
    { num: '03', symbol: '◇', title: 'Idratazione Duratura', desc: 'Potenzia la barriera cutanea con una formula a rilascio lento che mantiene l\'idratazione per 48 ore consecutive.' },
    { num: '04', symbol: '○', title: 'Effetto Luminosità', desc: 'Uniforma il tono e riduce macchie e discromie, restituendo alla pelle un aspetto luminoso e radioso già dalla seconda settimana.' },
    { num: '05', symbol: '△', title: 'Azione Calmante', desc: 'Il PDRN ha proprietà anti-infiammatorie documentate. Ideale per pelli sensibili, reattive o affaticate da agenti esterni.' },
    { num: '06', symbol: '□', title: 'Formula Biocompatibile', desc: 'Dermatologicamente testata, senza parabeni, siliconi occlusivi o profumi sintetici. Adatta a tutti i tipi di pelle.' }
  ];

  readonly reviews = [
    {
      name: 'Sofia M.',
      location: 'Milano',
      text: '"Dopo sole due settimane, la mia pelle è visibilmente più luminosa e le rughe sottili si sono ridotte notevolmente. Un prodotto straordinario che non abbandonerò più."'
    },
    {
      name: 'Giulia R.',
      location: 'Roma',
      text: '"La texture è leggerissima e si assorbe in pochi secondi. Non lascia nessun residuo grasso — perfetta anche sotto il trucco mattina e sera."'
    },
    {
      name: 'Valentina C.',
      location: 'Firenze',
      text: '"Ho la pelle molto sensibile e questa è la prima crema che non mi ha dato alcuna irritazione. La elasticità è migliorata in modo evidente già al primo mese."'
    }
  ];

  constructor() {
    this.title.setTitle('CELLURA — PDRN Renewal Cream');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchWaitlistCount();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollAnimations();
      this.initCellAnimation();
    }
  }

  // Modal actions
  openModal(): void {
    this.isModalOpen = true;
    this.showSuccess = false;
    this.alreadyRegistered.set(false);
    this.emailTouched = false;
    this.email = '';
    document.body.style.overflow = 'hidden';
  }

  closeModal(event?: MouseEvent): void {
    if (!event || (event.target as HTMLElement).classList.contains('modal-overlay') || (event.target as HTMLElement).classList.contains('modal-close')) {
      this.isModalOpen = false;
      document.body.style.overflow = '';
    }
  }

  // Mobile nav toggle
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    }
  }

  // Waitlist actions
  fetchWaitlistCount(): void {
    fetch(`/api/waitlist/count?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        this.waitlistCount.set(data.count);
      })
      .catch(e => console.error('Failed to load waitlist count:', e));
  }

  get isEmailValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());
  }

  decQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  incQty(): void {
    this.quantity++;
  }

  scrollToProduct(): void {
    if (isPlatformBrowser(this.platformId)) {
      const el = document.getElementById('prodotto');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  async submitWaitlist(): Promise<void> {
    this.emailTouched = true;
    this.alreadyRegistered.set(false);

    if (!this.isEmailValid) {
      return;
    }

    this.isSubmitting = true;
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email, quantity: this.quantity }),
      });

      if (response.status === 409) {
        this.alreadyRegistered.set(true);
        this.isModalOpen = true;
      } else if (response.ok) {
        if (isPlatformBrowser(this.platformId)) {
          const list = this.store.getWaitlist();
          const normalizedEmail = this.email.trim().toLowerCase();
          const alreadyExists = list.some((entry) => entry.email.toLowerCase() === normalizedEmail);
          if (!alreadyExists) {
            list.push({
              id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
              email: this.email.trim(),
              date: new Date().toISOString(),
              source: `waitlist-qty-${this.quantity}`
            });
            this.store.saveWaitlist(list);
          }
        }
        this.showSuccess = true;
        this.isModalOpen = true;
        this.fetchWaitlistCount();
      }
    } catch (err) {
      console.error('Waitlist submission failed:', err);
    } finally {
      this.isSubmitting = false;
    }
  }

  // Scroll animations observer
  private initScrollAnimations(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  }

  // Canvas Cell Animation
  private initCellAnimation(): void {
    const canvas = document.getElementById('cellCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;

    const COLORS = {
      bg: '#0d1117',
      cell: '#1a2744',
      cellBorder: '#2a4a7f',
      pdrn: '#5C9EC0',
      receptor: '#B87355',
      bound: '#8BC34A',
      collagen: '#C8DFF0',
      particle: '#E8F3FA'
    };

    // Cells
    const cells: any[] = [];
    for (let i = 0; i < 4; i++) {
      cells.push({
        x: 80 + (i % 2) * 200,
        y: 80 + Math.floor(i / 2) * 160,
        rx: 70, ry: 50,
        receptors: [] as any[],
        phase: Math.random() * Math.PI * 2
      });
    }
    cells.forEach((c: any) => {
      for (let j = 0; j < 5; j++) {
        const angle = (j / 5) * Math.PI * 2;
        c.receptors.push({ angle, bound: false, bindTimer: 0 });
      }
    });

    // PDRN particles
    const pdrns: any[] = [];
    for (let i = 0; i < 18; i++) {
      pdrns.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: 3 + Math.random() * 3,
        bound: false,
        targetCell: null,
        targetRec: null,
        alpha: 0.7 + Math.random() * 0.3
      });
    }

    // Collagen fibers growing
    const fibers: any[] = [];

    let frame = 0;

    const drawCell = (c: any) => {
      const pulse = 1 + Math.sin(frame * 0.02 + c.phase) * 0.015;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(pulse, pulse);
      // Nucleus glow
      const grd = ctx.createRadialGradient(0, 0, 5, 0, 0, 40);
      grd.addColorStop(0, 'rgba(42,74,127,0.6)');
      grd.addColorStop(1, 'rgba(26,39,68,0)');
      ctx.beginPath();
      ctx.ellipse(0, 0, 40, 28, 0, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      // Nucleus
      ctx.beginPath();
      ctx.ellipse(0, 0, 22, 15, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#1a3060';
      ctx.fill();
      ctx.strokeStyle = '#3a6aaf';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      // Cell body
      ctx.beginPath();
      ctx.ellipse(0, 0, c.rx, c.ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.cell;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = COLORS.cellBorder;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      // Receptors
      c.receptors.forEach((r: any) => {
        const rx = Math.cos(r.angle) * c.rx;
        const ry = Math.sin(r.angle) * c.ry;
        ctx.beginPath();
        ctx.arc(rx, ry, 5, 0, Math.PI * 2);
        ctx.fillStyle = r.bound ? COLORS.bound : COLORS.receptor;
        ctx.fill();
        // Receptor spike
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx + Math.cos(r.angle) * 10, ry + Math.sin(r.angle) * 10);
        ctx.strokeStyle = r.bound ? COLORS.bound : COLORS.receptor;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
      ctx.restore();
    };

    const drawPDRN = (p: any) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.bound ? COLORS.bound : COLORS.pdrn;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fill();
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      // Background
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, W, H);

      // Draw collagen fibers
      fibers.forEach((f: any) => {
        ctx.save();
        ctx.globalAlpha = f.alpha * 0.6;
        ctx.strokeStyle = COLORS.collagen;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(f.x1, f.y1);
        ctx.bezierCurveTo(f.cx, f.cy, f.cx2, f.cy2, f.x1 + (f.x2 - f.x1) * f.progress, f.y1 + (f.y2 - f.y1) * f.progress);
        ctx.stroke();
        ctx.restore();
        f.progress = Math.min(1, f.progress + 0.003);
      });

      // Draw cells
      cells.forEach(drawCell);

      // PDRN particles logic
      pdrns.forEach((p: any) => {
        if (!p.bound) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;

          // Check proximity to receptor
          cells.forEach((c: any) => {
            c.receptors.forEach((r: any) => {
              if (r.bound) return;
              const rx = c.x + Math.cos(r.angle) * c.rx;
              const ry = c.y + Math.sin(r.angle) * c.ry;
              const dist = Math.hypot(p.x - rx, p.y - ry);
              if (dist < 18) {
                p.bound = true;
                r.bound = true;
                p.x = rx + Math.cos(r.angle) * 8;
                p.y = ry + Math.sin(r.angle) * 8;
                // Spawn collagen fiber
                setTimeout(() => {
                  if (fibers.length < 30) {
                    fibers.push({
                      x1: c.x, y1: c.y,
                      x2: c.x + (Math.random() - 0.5) * 120,
                      y2: c.y + (Math.random() - 0.5) * 80,
                      cx: c.x + (Math.random() - 0.5) * 80,
                      cy: c.y + (Math.random() - 0.5) * 60,
                      cx2: c.x + (Math.random() - 0.5) * 100,
                      cy2: c.y + (Math.random() - 0.5) * 70,
                      progress: 0, alpha: 0.8
                    });
                  }
                }, 800);
              }
            });
          });
        }
        drawPDRN(p);
      });

      // Legend
      ctx.font = '10px DM Sans, sans-serif';
      const items = [
        { color: COLORS.pdrn, label: 'Molecola PDRN' },
        { color: COLORS.receptor, label: 'Recettore A2A' },
        { color: COLORS.bound, label: 'Legame attivo' },
        { color: COLORS.collagen, label: 'Fibra collagene' }
      ];
      items.forEach((it, i) => {
        ctx.fillStyle = it.color;
        ctx.fillRect(12, 12 + i * 20, 8, 8);
        ctx.fillStyle = 'rgba(245,239,230,0.6)';
        ctx.fillText(it.label, 26, 21 + i * 20);
      });

      frame++;
      requestAnimationFrame(tick);
    };

    tick();
  }
}
