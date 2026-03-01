import { TestBed } from '@angular/core/testing';
import { Category } from '../../core/models/category.model';
import { StorageService } from '../../core/services/storage.service';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let storage: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    storage = jasmine.createSpyObj<StorageService>('StorageService', [
      'get',
      'set',
      'remove',
    ]);

    TestBed.configureTestingModule({
      providers: [
        CategoriesService,
        { provide: StorageService, useValue: storage },
      ],
    });

    service = TestBed.inject(CategoriesService);
  });

  it('debe inicializar categorías desde almacenamiento', async () => {
    const seeded: Category[] = [
      { id: '1', name: 'Trabajo', createdAt: 1, updatedAt: 1 },
    ];
    storage.get.and.resolveTo(seeded);

    await service.init();

    expect(service.snapshot().length).toBe(1);
    expect(service.snapshot()[0].name).toBe('Trabajo');
  });

  it('debe crear una categoría y persistirla', async () => {
    storage.get.and.resolveTo([]);
    storage.set.and.resolveTo();

    await service.init();
    const created = await service.create('  Personal  ', '#fff');

    expect(created.name).toBe('Personal');
    expect(service.snapshot().length).toBe(1);
    expect(storage.set).toHaveBeenCalled();
  });

  it('debe rechazar creación con nombre vacío', async () => {
    storage.get.and.resolveTo([]);
    await service.init();

    await expectAsync(service.create('   ')).toBeRejectedWithError(
      'El nombre de la categoría es obligatorio',
    );
  });
});
