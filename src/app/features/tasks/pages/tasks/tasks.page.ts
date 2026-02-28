import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { combineLatest, map, startWith } from 'rxjs';

import { Category } from '../../../../core/models/category.model';
import { Task } from '../../../../core/models/task.model';
import { FeatureFlagsService } from '../../../../core/services/feature-flags.service';
import { CategoriesService } from '../../../categories/categories.service';
import { TasksService } from '../../tasks.service';

addIcons({ trashOutline });

type TasksVm = {
  categoriesEnabled: boolean;
  categories: Category[];
  tasks: Task[];
  selectedCategoryId: string | null;
};

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonList,
    IonLabel,
    IonCheckbox,
    IonButtons,
    IonIcon,
    IonSelect,
    IonSelectOption,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksPage {
  title = '';
  selectedCategoryId: string | null = null;
  selectedCategoryForNewTask: string | null = null;

  readonly vm$ = combineLatest([
    this.flags.categoriesEnabled$.pipe(
      startWith(this.flags.snapshotCategoriesEnabled()),
    ),
    this.categories.categories$,
    this.tasks.tasks$,
  ]).pipe(
    map(([categoriesEnabled, categories, tasks]) => {
      const selected = categoriesEnabled ? this.selectedCategoryId : null;

      const filtered = selected
        ? tasks.filter((t) => t.categoryId === selected)
        : tasks;

      const vm: TasksVm = {
        categoriesEnabled,
        categories,
        tasks: filtered,
        selectedCategoryId: selected,
      };

      return vm;
    }),
  );

  constructor(
    private readonly tasks: TasksService,
    private readonly categories: CategoriesService,
    private readonly flags: FeatureFlagsService,
  ) {}

  async addTask(): Promise<void> {
    const t = this.title.trim();
    if (!t) return;

    const categoryId = this.flags.snapshotCategoriesEnabled()
      ? this.selectedCategoryForNewTask
      : null;

    await this.tasks.create(t, categoryId);
    this.title = '';
    this.selectedCategoryForNewTask = null;
  }

  async toggle(task: Task): Promise<void> {
    await this.tasks.toggleCompleted(task.id);
  }

  async remove(task: Task): Promise<void> {
    await this.tasks.remove(task.id);
  }

  onFilterChange(value: string | null): void {
    this.selectedCategoryId = value;
  }
}
