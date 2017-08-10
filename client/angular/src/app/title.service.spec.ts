import { TestBed, inject } from '@angular/core/testing';

import { TitleService } from './title.service';

describe('TitleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TitleService]
    });
  });

  it('should be created', inject([TitleService], (service: TitleService) => {
    expect(service).toBeTruthy();
  }));
});
