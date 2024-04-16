import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivePage } from './active.page';

describe('ActivePage', () => {
  let component: ActivePage;
  let fixture: ComponentFixture<ActivePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ActivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
