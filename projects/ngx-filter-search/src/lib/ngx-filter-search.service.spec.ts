import { TestBed } from '@angular/core/testing';

import { NgxFilterSearchService } from './ngx-filter-search.service';

describe('NgxFilterSearchService', () => {
  let service: NgxFilterSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxFilterSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
