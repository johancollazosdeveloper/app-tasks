import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  createOutline,
  saveOutline,
  trashOutline,
} from 'ionicons/icons';

import { Category } from '../../../../core/models/category.model';
import { TasksService } from '../../../tasks/tasks.service';
import { CategoriesService } from '../../categories.service';

addIcons({ createOutline, trashOutline, closeOutline, saveOutline });

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
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
    IonButtons,
    IonIcon,
    IonModal,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage {
  name = '';
  color = '';

  isEditOpen = false;
  editId: string | null = null;
  editName = '';
  editColor = '';

  readonly categories$ = this.categories.categories$;

  constructor(
    private readonly categories: CategoriesService,
    private readonly tasks: TasksService,
  ) {}

  async addCategory(): Promise<void> {
    const n = this.name.trim();
    if (!n) return;

    const c = (this.color ?? '').trim();
    await this.categories.create(n, c || undefined);

    this.name = '';
    this.color = '';
  }

  openEdit(category: Category): void {
    this.editId = category.id;
    this.editName = category.name;
    this.editColor = category.color ?? '';
    this.isEditOpen = true;
  }

  closeEdit(): void {
    this.isEditOpen = false;
    this.editId = null;
    this.editName = '';
    this.editColor = '';
  }

  async saveEdit(): Promise<void> {
    if (!this.editId) return;

    const n = this.editName.trim();
    if (!n) return;

    const c = (this.editColor ?? '').trim();
    await this.categories.update(this.editId, {
      name: n,
      color: c || undefined,
    });
    this.closeEdit();
  }

  async removeCategory(category: Category): Promise<void> {
    // decisión de negocio defensiva: no borramos tareas, limpiamos referencia
    await this.tasks.clearCategory(category.id);
    await this.categories.remove(category.id);
  }
}
