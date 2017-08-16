import { TestBed, inject } from '@angular/core/testing';

import { KernelService } from './kernel.service';

describe('KernelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KernelService]
    });
  });

  it('should be created', inject([KernelService], (service: KernelService) => {
    expect(service).toBeTruthy();
  }));
});
