import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RejuvnStoreService } from '../../shared/rejuvn-store.service';

@Component({
  selector: 'app-out-of-stock-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './out-of-stock-page.component.html',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(to bottom, rgb(229, 214, 197) 0%, #ffffff 100%);
    }
  `]
})
export class OutOfStockPageComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly store = inject(RejuvnStoreService);
  private readonly platformId = inject(PLATFORM_ID);

  email = '';
  emailTouched = false;
  showSuccess = false;
  quantity = 1;
  isSubmitting = false;
  alreadyRegistered = signal(false);

  // Signal — automatically triggers UI update when value changes, bypasses SSR hydration issues
  waitlistCount = signal(0);

  constructor() {
    this.title.setTitle('REJUVN | Shop Now');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchWaitlistCount();
    }
  }

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
        // Email already registered
        this.alreadyRegistered.set(true);
      } else if (response.ok) {
        // Also save to local storage
        await this.store.addWaitlistEmail(this.email, this.quantity, 'waitlist');
        this.showSuccess = true;
        this.fetchWaitlistCount();
      }
    } catch (err) {
      console.error('Waitlist submission failed:', err);
    } finally {
      this.isSubmitting = false;
    }
  }
}
