import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { Task } from '../../core/models/task.model';
import { StorageService } from '../../core/services/storage.service';

const KEY = 'tasks';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly subject = new BehaviorSubject<Task[]>([]);
  readonly tasks$ = this.subject.asObservable();

  constructor(private readonly storage: StorageService) {}

  async init(): Promise<void> {
    const items = await this.storage.get<Task[]>(KEY, []);
    this.subject.next(items);
  }

  snapshot(): Task[] {
    return this.subject.value;
  }

  async create(title: string, categoryId?: string | null): Promise<Task> {
    const trimmed = (title ?? '').trim();
    if (!trimmed) throw new Error('El título de la tarea es obligatorio');

    const now = Date.now();
    const item: Task = {
      id: uuid(),
      title: trimmed,
      completed: false,
      categoryId: categoryId ?? null,
      createdAt: now,
      updatedAt: now,
    };

    const next = [item, ...this.subject.value];
    this.subject.next(next);
    await this.storage.set(KEY, next);
    return item;
  }

  async toggleCompleted(id: string): Promise<void> {
    const next = this.subject.value.map((t) =>
      t.id === id
        ? { ...t, completed: !t.completed, updatedAt: Date.now() }
        : t,
    );
    this.subject.next(next);
    await this.storage.set(KEY, next);
  }

  async remove(id: string): Promise<void> {
    const next = this.subject.value.filter((t) => t.id !== id);
    this.subject.next(next);
    await this.storage.set(KEY, next);
  }

  async clearCategory(categoryId: string): Promise<void> {
    const next = this.subject.value.map((t) =>
      t.categoryId === categoryId
        ? { ...t, categoryId: null, updatedAt: Date.now() }
        : t,
    );
    this.subject.next(next);
    await this.storage.set(KEY, next);
  }
}
