import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkersPage } from './workers.page';

describe('WorkersPage', () => {
  let component: WorkersPage;
  let fixture: ComponentFixture<WorkersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WorkersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
