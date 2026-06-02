import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RejuvnStoreService } from '../../shared/rejuvn-store.service';

@Component({
  selector: 'app-out-of-stock-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './out-of-stock-page.component.html'
})
export class OutOfStockPageComponent {
  private readonly title = inject(Title);
  private readonly store = inject(RejuvnStoreService);

  email = '';
  emailTouched = false;
  showSuccess = false;

  constructor() {
    this.title.setTitle('REJUVN | Notify Me');
  }

  get isEmailValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());
  }

  submitWaitlist(): void {
    this.emailTouched = true;

    if (!this.isEmailValid) {
      return;
    }

    this.store.addWaitlistEmail(this.email, 'notify-me');
    this.showSuccess = true;
  }
}
