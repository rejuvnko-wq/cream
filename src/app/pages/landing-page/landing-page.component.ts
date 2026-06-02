import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

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
  imports: [RouterLink],
  templateUrl: './landing-page.component.html'
})
export class LandingPageComponent {
  private readonly title = inject(Title);

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
    this.title.setTitle('REJUVN | Clean Korean Skincare');
  }
}
