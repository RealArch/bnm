import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectWorkTypePage } from './select-work-type.page';

describe('SelectWorkTypePage', () => {
  let component: SelectWorkTypePage;
  let fixture: ComponentFixture<SelectWorkTypePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectWorkTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
