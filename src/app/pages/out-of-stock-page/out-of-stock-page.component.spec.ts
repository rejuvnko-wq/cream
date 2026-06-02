import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OutOfStockPageComponent } from './out-of-stock-page.component';

describe('OutOfStockPageComponent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutOfStockPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('stores a restock request and shows the success state', () => {
    const fixture = TestBed.createComponent(OutOfStockPageComponent);
    const component = fixture.componentInstance;
    component.email = 'test@example.com';
    fixture.detectChanges();
    component.submitWaitlist();

    expect(localStorage.getItem('rejuvn_waitlist')).toContain('test@example.com');
    expect(component.showSuccess).toBe(true);
  });
});
