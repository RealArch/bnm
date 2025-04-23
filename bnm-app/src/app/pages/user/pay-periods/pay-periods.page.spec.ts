import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayPeriodsPage } from './pay-periods.page';

describe('PayPeriodsPage', () => {
  let component: PayPeriodsPage;
  let fixture: ComponentFixture<PayPeriodsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PayPeriodsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
