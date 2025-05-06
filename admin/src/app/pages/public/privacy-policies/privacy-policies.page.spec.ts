import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacyPoliciesPage } from './privacy-policies.page';

describe('PrivacyPoliciesPage', () => {
  let component: PrivacyPoliciesPage;
  let fixture: ComponentFixture<PrivacyPoliciesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PrivacyPoliciesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
