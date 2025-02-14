import { TestBed } from '@angular/core/testing';

import { ShadowPluginService } from './shadow-plugin.service';

describe('ShadowPluginService', () => {
  let service: ShadowPluginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShadowPluginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
