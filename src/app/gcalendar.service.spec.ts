import { TestBed } from '@angular/core/testing';

import { GcalendarService } from './gcalendar.service';

describe('GcalendarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GcalendarService = TestBed.get(GcalendarService);
    expect(service).toBeTruthy();
  });
});
