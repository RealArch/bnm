import { TestBed } from '@angular/core/testing';

import { IsActiveUserGuard } from './is-active-user.guard';

describe('IsActiveUserGuard', () => {
  let guard: IsActiveUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsActiveUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
