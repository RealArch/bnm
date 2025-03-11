import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAndActivateModalPage } from './edit-and-activate-modal.page';

describe('EditAndActivateModalPage', () => {
  let component: EditAndActivateModalPage;
  let fixture: ComponentFixture<EditAndActivateModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditAndActivateModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
