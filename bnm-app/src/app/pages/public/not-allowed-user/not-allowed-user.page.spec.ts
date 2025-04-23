import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotAllowedUserPage } from './not-allowed-user.page';

describe('NotAllowedUserPage', () => {
  let component: NotAllowedUserPage;
  let fixture: ComponentFixture<NotAllowedUserPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NotAllowedUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
