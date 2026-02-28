import { TestBed } from '@angular/core/testing';
import { FeatureFlagsService } from './feature-flags.service';

describe('FeatureFlagsService', () => {
  let service: FeatureFlagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeatureFlagsService],
    });
    service = TestBed.inject(FeatureFlagsService);
  });

  it('debe exponer categoriesEnabled$ con valor por defecto true', () => {
    expect(service.snapshotCategoriesEnabled()).toBeTrue();
  });

  it('debe iniciar con ready en false', () => {
    expect(service.snapshotReady()).toBeFalse();
  });
});
