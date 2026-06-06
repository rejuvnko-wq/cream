import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './privacy-page.component.html'
})
export class PrivacyPageComponent {
  constructor() {
    inject(Title).setTitle('REJUVN | Privacy Policy');
  }
}
