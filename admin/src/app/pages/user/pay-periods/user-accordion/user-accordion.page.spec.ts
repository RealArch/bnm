import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAccordionPage } from './user-accordion.page';

describe('UserAccordionPage', () => {
  let component: UserAccordionPage;
  let fixture: ComponentFixture<UserAccordionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserAccordionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
