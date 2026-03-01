import { Routes } from '@angular/router';
import { categoriesEnabledGuard } from './core/guards/categories-enabled.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/tasks/pages/tasks/tasks.page').then(
        (m) => m.TasksPage,
      ),
  },
  {
    path: 'categorias',
    canMatch: [categoriesEnabledGuard],
    loadComponent: () =>
      import('./features/categories/pages/categories/categories.page').then(
        (m) => m.CategoriesPage,
      ),
  },
  { path: '**', redirectTo: '' },
];
