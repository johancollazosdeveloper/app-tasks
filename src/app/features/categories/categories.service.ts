import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { Category } from '../../core/models/category.model';
import { StorageService } from '../../core/services/storage.service';

const KEY = 'categories';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly subject = new BehaviorSubject<Category[]>([]);
  readonly categories$ = this.subject.asObservable();

  constructor(
    @Inject(StorageService) private readonly storage: StorageService,
  ) {}

  async init(): Promise<void> {
    const items = await this.storage.get<Category[]>(KEY, []);
    this.subject.next(items);
  }

  snapshot(): Category[] {
    return this.subject.value;
  }

  async create(name: string, color?: string): Promise<Category> {
    const trimmed = (name ?? '').trim();
    if (!trimmed) throw new Error('El nombre de la categoría es obligatorio');

    const now = Date.now();
    const item: Category = {
      id: uuid(),
      name: trimmed,
      color,
      createdAt: now,
      updatedAt: now,
    };

    const next = [item, ...this.subject.value];
    this.subject.next(next);
    await this.storage.set(KEY, next);
    return item;
  }

  async update(
    id: string,
    patch: { name?: string; color?: string },
  ): Promise<void> {
    const next = this.subject.value.map((c) => {
      if (c.id !== id) return c;

      const name = patch.name !== undefined ? patch.name.trim() : c.name;
      if (!name) throw new Error('El nombre de la categoría es obligatorio');

      return {
        ...c,
        name,
        color: patch.color !== undefined ? patch.color : c.color,
        updatedAt: Date.now(),
      };
    });

    this.subject.next(next);
    await this.storage.set(KEY, next);
  }

  async remove(id: string): Promise<void> {
    const next = this.subject.value.filter((c) => c.id !== id);
    this.subject.next(next);
    await this.storage.set(KEY, next);
  }
}
