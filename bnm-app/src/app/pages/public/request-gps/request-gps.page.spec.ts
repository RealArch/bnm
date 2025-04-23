import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestGpsPage } from './request-gps.page';

describe('RequestGpsPage', () => {
  let component: RequestGpsPage;
  let fixture: ComponentFixture<RequestGpsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestGpsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
