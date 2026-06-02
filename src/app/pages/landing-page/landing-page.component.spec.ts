import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders the clean collections layout', () => {
    const fixture = TestBed.createComponent(LandingPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('img[alt="REJUVN PDRN Cream product image"]')).toBeTruthy();
    expect(compiled.textContent).toContain('Collections');
    expect(compiled.textContent).toContain('PDRN Cream');
  });
});
