import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { PrivacyPageComponent } from './pages/privacy-page/privacy-page.component';
import { OutOfStockPageComponent } from './pages/out-of-stock-page/out-of-stock-page.component';

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
    path: 'out-of-stock',
    component: OutOfStockPageComponent,
    title: 'REJUVN | Notify Me'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
