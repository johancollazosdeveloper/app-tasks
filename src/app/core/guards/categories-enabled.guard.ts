import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { FeatureFlagsService } from '../services/feature-flags.service';

export const categoriesEnabledGuard: CanMatchFn = () => {
  const flags = inject(FeatureFlagsService);
  const router = inject(Router);

  return flags.ready$.pipe(
    filter(Boolean),
    take(1),
    map(() => {
      if (flags.snapshotCategoriesEnabled()) return true;
      router.navigateByUrl('/');
      return false;
    }),
  );
};
