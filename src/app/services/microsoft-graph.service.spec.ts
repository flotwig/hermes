import { TestBed, inject } from '@angular/core/testing';

import { MicrosoftGraphService } from './microsoft-graph.service';

describe('MicrosoftGraphService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MicrosoftGraphService]
    });
  });

  it('should be created', inject([MicrosoftGraphService], (service: MicrosoftGraphService) => {
    expect(service).toBeTruthy();
  }));
});
