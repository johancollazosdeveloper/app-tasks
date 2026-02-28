import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  let ionicStorage: jasmine.SpyObj<Storage>;
  let storageFactory: { create: jasmine.Spy };

  beforeEach(() => {
    ionicStorage = jasmine.createSpyObj<Storage>('Storage', [
      'get',
      'set',
      'remove',
      'clear',
    ]);

    storageFactory = {
      create: jasmine.createSpy('create').and.resolveTo(ionicStorage),
    };

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: Storage, useValue: storageFactory },
      ],
    });

    service = TestBed.inject(StorageService);
  });

  it('debe inicializar el storage llamando create()', async () => {
    ionicStorage.get.and.resolveTo(undefined);

    await service.get('k', null);

    expect(storageFactory.create).toHaveBeenCalled();
  });

  it('debe devolver fallback cuando no existe valor', async () => {
    ionicStorage.get.and.resolveTo(undefined);

    const value = await service.get('no-existe', []);

    expect(value).toEqual([]);
  });

  it('debe devolver el valor cuando existe', async () => {
    ionicStorage.get.and.resolveTo([{ id: 1 }]);

    const value = await service.get<Array<{ id: number }>>('existe', []);

    expect(value).toEqual([{ id: 1 }]);
  });

  it('debe persistir con set()', async () => {
    ionicStorage.set.and.resolveTo();

    await service.set('a', { ok: true });

    expect(ionicStorage.set).toHaveBeenCalledWith('a', { ok: true });
  });

  it('debe eliminar con remove()', async () => {
    ionicStorage.remove.and.resolveTo();

    await service.remove('a');

    expect(ionicStorage.remove).toHaveBeenCalledWith('a');
  });

  it('debe limpiar con clear()', async () => {
    ionicStorage.clear.and.resolveTo();

    await service.clear();

    expect(ionicStorage.clear).toHaveBeenCalled();
  });
});
