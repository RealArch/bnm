import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAddMaterialsPage } from './modal-add-materials.page';

describe('ModalAddMaterialsPage', () => {
  let component: ModalAddMaterialsPage;
  let fixture: ComponentFixture<ModalAddMaterialsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddMaterialsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
