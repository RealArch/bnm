import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignPadModalPage } from './sign-pad-modal.page';

describe('SignPadModalPage', () => {
  let component: SignPadModalPage;
  let fixture: ComponentFixture<SignPadModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SignPadModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
