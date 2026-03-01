import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

import { environment } from '../environments/environment';
import { FeatureFlagsService } from './core/services/feature-flags.service';
import { CategoriesService } from './features/categories/categories.service';
import { TasksService } from './features/tasks/tasks.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly flags: FeatureFlagsService,
    private readonly categories: CategoriesService,
    private readonly tasks: TasksService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.flags.init(environment.firebaseConfig, {
      isDev: !environment.production,
    });

    await this.tasks.init();

    if (this.flags.snapshotCategoriesEnabled()) {
      await this.categories.init();
    }
  }
}
