import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSheetModalPage } from './time-sheet-modal.page';

describe('TimeSheetModalPage', () => {
  let component: TimeSheetModalPage;
  let fixture: ComponentFixture<TimeSheetModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TimeSheetModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
