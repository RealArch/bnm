import { TestBed } from '@angular/core/testing';

import { WorkOrdersService } from './work-orders.service';

describe('WorkOrdersService', () => {
  let service: WorkOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
