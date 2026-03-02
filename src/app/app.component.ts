import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  IonApp,
  IonContent,
  IonRouterOutlet,
  IonSpinner,
} from '@ionic/angular/standalone';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../environments/environment';
import { FeatureFlagsService } from './core/services/feature-flags.service';
import { CategoriesService } from './features/categories/categories.service';
import { TasksService } from './features/tasks/tasks.service';

declare const navigator: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet, IonContent, IonSpinner],
})
export class AppComponent {
  private readonly readySubject = new BehaviorSubject<boolean>(false);
  readonly ready$ = this.readySubject.asObservable();

  constructor(
    private readonly flags: FeatureFlagsService,
    private readonly categories: CategoriesService,
    private readonly tasks: TasksService,
  ) {
    this.bootstrap();
  }

  private async bootstrap(): Promise<void> {
    try {
      await this.flags.init(environment.firebaseConfig, {
        isDev: !environment.production,
      });

      await this.tasks.init();

      if (this.flags.snapshotCategoriesEnabled()) {
        await this.categories.init();
      }
    } catch (e) {
      console.error('[BOOT] Error inicializando app', e);
    } finally {
      if (navigator?.splashscreen?.hide) {
        navigator.splashscreen.hide();
      }

      this.readySubject.next(true);
    }
  }
}
