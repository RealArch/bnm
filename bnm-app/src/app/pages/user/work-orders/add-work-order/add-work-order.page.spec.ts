import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddWorkOrderPage } from './add-work-order.page';

describe('AddWorkOrderPage', () => {
  let component: AddWorkOrderPage;
  let fixture: ComponentFixture<AddWorkOrderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
