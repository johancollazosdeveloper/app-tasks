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
import { Router } from '@angular/router';
import { pricetagOutline, trashOutline } from 'ionicons/icons';
import { BehaviorSubject, combineLatest, map, startWith } from 'rxjs';

import { Category } from '../../../../core/models/category.model';
import { Task } from '../../../../core/models/task.model';
import { FeatureFlagsService } from '../../../../core/services/feature-flags.service';
import { CategoriesService } from '../../../categories/categories.service';
import { TasksService } from '../../tasks.service';

type TasksVm = {
  categoriesEnabled: boolean;
  categories: Category[];
  categoryNameById: Map<string, string>;
  categoryColorById: Map<string, string>;
  tasks: Task[];
  selectedCategoryId: string | null;
  selectedCategoryColor: string | null;
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
  selectedCategoryForNewTask: string | null = null;

  readonly trashOutline = trashOutline;
  readonly pricetagOutline = pricetagOutline;

  private readonly selectedCategoryId$ = new BehaviorSubject<string | null>(
    null,
  );

  readonly vm$ = combineLatest([
    this.flags.categoriesEnabled$.pipe(
      startWith(this.flags.snapshotCategoriesEnabled()),
    ),
    this.categories.categories$,
    this.tasks.tasks$,
    this.selectedCategoryId$,
  ]).pipe(
    map(([categoriesEnabled, categories, tasks, selectedCategoryId]) => {
      const selected = categoriesEnabled ? selectedCategoryId : null;

      const filtered = selected
        ? tasks.filter((t) => t.categoryId === selected)
        : tasks;

      const categoryNameById = new Map<string, string>(
        categories.map((c) => [c.id, c.name]),
      );

      const categoryColorById = new Map<string, string>(
        categories
          .filter((c) => !!c.color)
          .map((c) => [c.id, c.color as string]),
      );

      const selectedCategoryColor = selected
        ? (categoryColorById.get(selected) ?? null)
        : null;

      const vm: TasksVm = {
        categoriesEnabled,
        categories,
        categoryNameById,
        categoryColorById,
        tasks: filtered,
        selectedCategoryId: selected,
        selectedCategoryColor,
      };

      return vm;
    }),
  );

  constructor(
    private readonly tasks: TasksService,
    private readonly categories: CategoriesService,
    private readonly flags: FeatureFlagsService,
    private readonly router: Router,
  ) {}

  goToCategories(): void {
    (document.activeElement as HTMLElement | null)?.blur();
    this.router.navigateByUrl('/categorias');
  }

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
    this.selectedCategoryId$.next(value);
  }
}
