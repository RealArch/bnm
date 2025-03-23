import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewBlocksModalPage } from './view-blocks-modal.page';

describe('ViewBlocksModalPage', () => {
  let component: ViewBlocksModalPage;
  let fixture: ComponentFixture<ViewBlocksModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewBlocksModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
