import { TestBed } from '@angular/core/testing';

import { SkipLinkService } from './skip-link.service';

describe('SkipLinkService', () => {
  let service: SkipLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkipLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
