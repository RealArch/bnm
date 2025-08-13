import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAddEquipmentPage } from './modal-add-equipment.page';

describe('ModalAddEquipmentPage', () => {
  let component: ModalAddEquipmentPage;
  let fixture: ComponentFixture<ModalAddEquipmentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddEquipmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
