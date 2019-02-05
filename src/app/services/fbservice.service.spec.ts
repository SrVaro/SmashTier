import { TestBed } from '@angular/core/testing';

import { FBServiceService } from './fbservice.service';

describe('FBServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FBServiceService = TestBed.get(FBServiceService);
    expect(service).toBeTruthy();
  });
});
