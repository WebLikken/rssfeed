import { TestBed, inject } from '@angular/core/testing';

import { RssFeedService } from './rss-feed.service';

describe('RssFeedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RssFeedService]
    });
  });

  it('should be created', inject([RssFeedService], (service: RssFeedService) => {
    expect(service).toBeTruthy();
  }));
});
