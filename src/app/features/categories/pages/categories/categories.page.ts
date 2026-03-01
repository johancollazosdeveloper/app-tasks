import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
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
import {
  closeOutline,
  createOutline,
  saveOutline,
  trashOutline,
} from 'ionicons/icons';

import { Category } from '../../../../core/models/category.model';
import { TasksService } from '../../../tasks/tasks.service';
import { CategoriesService } from '../../categories.service';

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
    IonBackButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage {
  @ViewChild('editModal') editModal?: IonModal;

  name = '';
  color = '';

  isEditOpen = false;
  editId: string | null = null;
  editName = '';
  editColor = '';

  isColorOpen = false;
  isEditColorOpen = false;

  readonly categories$ = this.categories.categories$;
  readonly createOutline = createOutline;
  readonly trashOutline = trashOutline;
  readonly closeOutline = closeOutline;
  readonly saveOutline = saveOutline;

  constructor(
    private readonly categories: CategoriesService,
    private readonly tasks: TasksService,
  ) {}

  normalizeColor(value: string | null | undefined): string | null {
    const v = (value ?? '').trim();
    if (!v) return null;
    const hex = v.startsWith('#') ? v : `#${v}`;
    return /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : null;
  }

  clearColor(): void {
    this.color = '';
  }

  clearEditColor(): void {
    this.editColor = '';
  }

  async addCategory(): Promise<void> {
    const n = this.name.trim();
    if (!n) return;

    const c = this.normalizeColor(this.color);
    await this.categories.create(n, c ?? undefined);

    this.name = '';
    this.color = '';
  }

  openEdit(category: Category): void {
    this.editId = category.id;
    this.editName = category.name;
    this.editColor = this.normalizeColor(category.color) ?? '';
    this.isEditOpen = true;
  }

  async closeEdit(): Promise<void> {
    this.isEditOpen = false;
    this.isEditColorOpen = false;
    this.editId = null;
    this.editName = '';
    this.editColor = '';

    await this.editModal?.dismiss();
  }

  async saveEdit(): Promise<void> {
    if (!this.editId) return;

    const n = this.editName.trim();
    if (!n) return;

    const c = this.normalizeColor(this.editColor);
    await this.categories.update(this.editId, {
      name: n,
      color: c ?? undefined,
    });

    await this.closeEdit();
  }

  async removeCategory(category: Category): Promise<void> {
    await this.tasks.clearCategory(category.id);
    await this.categories.remove(category.id);
  }
}
