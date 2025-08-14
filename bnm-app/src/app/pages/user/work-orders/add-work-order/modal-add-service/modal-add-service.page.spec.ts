import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAddServicePage } from './modal-add-service.page';

describe('ModalAddServicePage', () => {
  let component: ModalAddServicePage;
  let fixture: ComponentFixture<ModalAddServicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
