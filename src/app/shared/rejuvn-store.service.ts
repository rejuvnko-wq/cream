import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface WaitlistEntry {
  id: string;
  email: string;
  date: string;
  source: string;
}

export const REJUVN_WAITLIST_KEY = 'rejuvn_waitlist';

@Injectable({
  providedIn: 'root'
})
export class RejuvnStoreService {
  private readonly platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getWaitlist(): WaitlistEntry[] {
    if (!this.isBrowser) {
      return [];
    }

    try {
      return JSON.parse(localStorage.getItem(REJUVN_WAITLIST_KEY) || '[]') as WaitlistEntry[];
    } catch {
      return [];
    }
  }

  saveWaitlist(list: WaitlistEntry[]): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(REJUVN_WAITLIST_KEY, JSON.stringify(list));
  }

  async addWaitlistEmail(email: string, quantity = 1, source = 'waitlist'): Promise<boolean> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return false;
    }

    // Attempt to save to backend API
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail, quantity }),
      });

      if (!response.ok) {
        console.error('Failed to save to backend waitlist API:', await response.text());
      }
    } catch (err) {
      console.error('Error calling waitlist API:', err);
    }

    // Save to local storage for local persistence
    if (this.isBrowser) {
      const list = this.getWaitlist();
      const alreadyExists = list.some((entry) => entry.email.toLowerCase() === normalizedEmail);
      if (!alreadyExists) {
        list.push({
          id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          email: email.trim(),
          date: new Date().toISOString(),
          source: `${source}-qty-${quantity}`
        });
        this.saveWaitlist(list);
      }
    }

    return true;
  }

}
