import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private ready: Promise<Storage>;

  constructor(private readonly storage: Storage) {
    this.ready = this.storage.create();
  }

  async get<T>(key: string, fallback: T): Promise<T> {
    const s = await this.ready;
    const value = await s.get(key);
    return (value ?? fallback) as T;
  }

  async set<T>(key: string, value: T): Promise<void> {
    const s = await this.ready;
    await s.set(key, value);
  }

  async remove(key: string): Promise<void> {
    const s = await this.ready;
    await s.remove(key);
  }

  async clear(): Promise<void> {
    const s = await this.ready;
    await s.clear();
  }
}
