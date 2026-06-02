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

  addWaitlistEmail(email: string, source = 'waitlist'): boolean {
    const list = this.getWaitlist();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return false;
    }

    const alreadyExists = list.some((entry) => entry.email.toLowerCase() === normalizedEmail);
    if (alreadyExists) {
      return false;
    }

    list.push({
      id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      email: email.trim(),
      date: new Date().toISOString(),
      source
    });

    this.saveWaitlist(list);
    return true;
  }
}
