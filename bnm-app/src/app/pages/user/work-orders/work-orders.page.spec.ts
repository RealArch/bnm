import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkOrdersPage } from './work-orders.page';

describe('WorkOrdersPage', () => {
  let component: WorkOrdersPage;
  let fixture: ComponentFixture<WorkOrdersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
