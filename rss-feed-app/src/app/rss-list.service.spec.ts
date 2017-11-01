import { TestBed, inject } from '@angular/core/testing';

import { RssListService } from './rss-list.service';

describe('RssListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RssListService]
    });
  });

  it('should be created', inject([RssListService], (service: RssListService) => {
    expect(service).toBeTruthy();
  }));
});
