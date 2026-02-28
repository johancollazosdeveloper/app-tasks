import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { FeatureFlagsService } from './core/services/feature-flags.service';
import { CategoriesService } from './features/categories/categories.service';
import { TasksService } from './features/tasks/tasks.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly flags: FeatureFlagsService,
    private readonly categories: CategoriesService,
    private readonly tasks: TasksService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.flags.init(environment.firebaseConfig);
    await this.categories.init();
    await this.tasks.init();
  }
}
