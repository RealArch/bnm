import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewWorkOrderPage } from './review-work-order.page';

describe('ReviewWorkOrderPage', () => {
  let component: ReviewWorkOrderPage;
  let fixture: ComponentFixture<ReviewWorkOrderPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReviewWorkOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
