import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProfileModalPage } from './edit-profile-modal.page';

describe('EditProfileModalPage', () => {
  let component: EditProfileModalPage;
  let fixture: ComponentFixture<EditProfileModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditProfileModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
