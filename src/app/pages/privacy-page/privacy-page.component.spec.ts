import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PrivacyPageComponent } from './privacy-page.component';

describe('PrivacyPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders the privacy policy structure', () => {
    const fixture = TestBed.createComponent(PrivacyPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Privacy Policy');
    expect(compiled.textContent).toContain('Titolare del trattamento');
    expect(compiled.textContent).toContain('privacy@rejuvn.com');
  });
});
