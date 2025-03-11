import { TestBed } from '@angular/core/testing';

import { PaychecksService } from './paychecks.service';

describe('PaychecksService', () => {
  let service: PaychecksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaychecksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
