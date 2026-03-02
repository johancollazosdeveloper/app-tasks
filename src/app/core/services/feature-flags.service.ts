import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
  RemoteConfig,
} from 'firebase/remote-config';
import { BehaviorSubject } from 'rxjs';

type FeatureFlags = {
  ff_categories: boolean;
};

@Injectable({ providedIn: 'root' })
export class FeatureFlagsService {
  private app: FirebaseApp | null = null;
  private rc: RemoteConfig | null = null;

  private readonly categoriesEnabledSubject = new BehaviorSubject<boolean>(
    false,
  );
  readonly categoriesEnabled$ = this.categoriesEnabledSubject.asObservable();

  private readonly readySubject = new BehaviorSubject<boolean>(false);
  readonly ready$ = this.readySubject.asObservable();

  async init(
    firebaseConfig: object,
    opts?: { isDev?: boolean },
  ): Promise<void> {
    this.app = initializeApp(firebaseConfig);
    this.rc = getRemoteConfig(this.app);

    this.rc.defaultConfig = { ff_categories: false } satisfies FeatureFlags;
    this.rc.settings.minimumFetchIntervalMillis = opts?.isDev ? 0 : 0;
    this.rc.settings.fetchTimeoutMillis = 5000;

    try {
      await fetchAndActivate(this.rc);
    } catch (e) {
      console.warn(
        '[FeatureFlags] Remote Config no disponible, usando defaults',
        e,
      );
    }

    const v = getValue(this.rc, 'ff_categories');
    this.categoriesEnabledSubject.next(v.asBoolean());

    if (opts?.isDev) {
      console.log(
        '[RC] ff_categories=',
        v.asBoolean(),
        'source=',
        v.getSource(),
      );
    }

    this.readySubject.next(true);
  }

  snapshotCategoriesEnabled(): boolean {
    return this.categoriesEnabledSubject.value;
  }

  snapshotReady(): boolean {
    return this.readySubject.value;
  }
}
