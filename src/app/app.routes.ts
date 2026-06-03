import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { PrivacyPageComponent } from './pages/privacy-page/privacy-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    title: 'REJUVN | Clean Korean Skincare'
  },
  {
    path: 'privacy',
    component: PrivacyPageComponent,
    title: 'REJUVN | Privacy Policy'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
