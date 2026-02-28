import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
  RemoteConfig,
} from 'firebase/remote-config';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FeatureFlagsService {
  private app: FirebaseApp | null = null;
  private rc: RemoteConfig | null = null;

  private readonly categoriesEnabledSubject = new BehaviorSubject<boolean>(
    true,
  );
  readonly categoriesEnabled$ = this.categoriesEnabledSubject.asObservable();

  async init(firebaseConfig: object): Promise<void> {
    this.app = initializeApp(firebaseConfig);
    this.rc = getRemoteConfig(this.app);

    this.rc.settings.minimumFetchIntervalMillis = 60_000;
    this.rc.defaultConfig = { ff_categories: true };

    try {
      await fetchAndActivate(this.rc);
    } catch {}

    const enabled = getValue(this.rc, 'ff_categories').asBoolean();
    this.categoriesEnabledSubject.next(enabled);
  }

  snapshotCategoriesEnabled(): boolean {
    return this.categoriesEnabledSubject.value;
  }
}
