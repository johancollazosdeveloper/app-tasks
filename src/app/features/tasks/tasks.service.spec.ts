import { TestBed } from '@angular/core/testing';
import { Task } from '../../core/models/task.model';
import { StorageService } from '../../core/services/storage.service';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let storage: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    storage = jasmine.createSpyObj<StorageService>('StorageService', [
      'get',
      'set',
      'remove',
    ]);

    TestBed.configureTestingModule({
      providers: [TasksService, { provide: StorageService, useValue: storage }],
    });

    service = TestBed.inject(TasksService);
  });

  it('debe inicializar tareas desde almacenamiento', async () => {
    const seeded: Task[] = [
      {
        id: '1',
        title: 'Tarea',
        completed: false,
        categoryId: null,
        createdAt: 1,
        updatedAt: 1,
      },
    ];
    storage.get.and.resolveTo(seeded);

    await service.init();

    expect(service.snapshot().length).toBe(1);
    expect(service.snapshot()[0].title).toBe('Tarea');
  });

  it('debe crear tarea y persistirla', async () => {
    storage.get.and.resolveTo([]);
    storage.set.and.resolveTo();

    await service.init();
    const created = await service.create('  Comprar  ', 'cat1');

    expect(created.title).toBe('Comprar');
    expect(created.categoryId).toBe('cat1');
    expect(service.snapshot().length).toBe(1);
    expect(storage.set).toHaveBeenCalled();
  });

  it('debe limpiar categoría de tareas asociadas', async () => {
    const seeded: Task[] = [
      {
        id: '1',
        title: 'A',
        completed: false,
        categoryId: 'cat1',
        createdAt: 1,
        updatedAt: 1,
      },
      {
        id: '2',
        title: 'B',
        completed: true,
        categoryId: 'cat2',
        createdAt: 1,
        updatedAt: 1,
      },
    ];
    storage.get.and.resolveTo(seeded);
    storage.set.and.resolveTo();

    await service.init();
    await service.clearCategory('cat1');

    const after = service.snapshot();
    expect(after.find((t) => t.id === '1')?.categoryId).toBeNull();
    expect(after.find((t) => t.id === '2')?.categoryId).toBe('cat2');
    expect(storage.set).toHaveBeenCalled();
  });

  it('debe rechazar creación con título vacío', async () => {
    storage.get.and.resolveTo([]);
    await service.init();

    await expectAsync(service.create('   ')).toBeRejectedWithError(
      'El título de la tarea es obligatorio',
    );
  });
});
