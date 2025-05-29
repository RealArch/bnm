import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigsPage } from './configs.page';

describe('ConfigsPage', () => {
  let component: ConfigsPage;
  let fixture: ComponentFixture<ConfigsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConfigsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
