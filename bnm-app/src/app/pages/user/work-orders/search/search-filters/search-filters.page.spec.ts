import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFiltersPage } from './search-filters.page';

describe('SearchFiltersPage', () => {
  let component: SearchFiltersPage;
  let fixture: ComponentFixture<SearchFiltersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFiltersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
