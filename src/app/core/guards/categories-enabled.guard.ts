import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { FeatureFlagsService } from '../services/feature-flags.service';

export const categoriesEnabledGuard: CanMatchFn = () => {
  const flags = inject(FeatureFlagsService);
  const router = inject(Router);

  if (flags.snapshotCategoriesEnabled()) return true;

  router.navigateByUrl('/');
  return false;
};
