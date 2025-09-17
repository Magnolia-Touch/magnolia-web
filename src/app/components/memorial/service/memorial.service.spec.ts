import { TestBed } from '@angular/core/testing';

import { MemorialService } from './memorial.service';

describe('MemorialService', () => {
  let service: MemorialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemorialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
