import { TestBed } from '@angular/core/testing';

import { ScheduleService } from '../services/schedule-service.service';

describe('ScheduleService', () => {
  let service: ScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
