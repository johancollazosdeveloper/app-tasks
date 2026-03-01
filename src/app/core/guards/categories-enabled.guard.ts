import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { FeatureFlagsService } from '../services/feature-flags.service';

export const categoriesEnabledGuard: CanMatchFn = (): import('rxjs').Observable<
  boolean | UrlTree
> => {
  const flags = inject(FeatureFlagsService);
  const router = inject(Router);

  return flags.ready$.pipe(
    filter(Boolean),
    take(1),
    map(() =>
      flags.snapshotCategoriesEnabled() ? true : router.createUrlTree(['/']),
    ),
  );
};
