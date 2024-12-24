import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCustomerModalPage } from './add-customer-modal.page';

describe('AddCustomerModalPage', () => {
  let component: AddCustomerModalPage;
  let fixture: ComponentFixture<AddCustomerModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddCustomerModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
