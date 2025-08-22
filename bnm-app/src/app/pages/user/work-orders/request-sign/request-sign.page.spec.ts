import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestSignPage } from './request-sign.page';

describe('RequestSignPage', () => {
  let component: RequestSignPage;
  let fixture: ComponentFixture<RequestSignPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
