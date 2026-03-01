# Prueba Técnica -- Aplicación de Gestión de Tareas

**Stack:** Ionic 7 + Angular Standalone + Firebase Remote Config\
**Arquitectura:** Modular por dominio + Estado reactivo

Aplicación híbrida orientada a demostrar buenas prácticas de
arquitectura, manejo de estado, feature flags remotos y optimización de
rendimiento en Angular moderno.

---

## Objetivo Técnico

Extender una aplicación base de tareas incorporando:

- Gestión de categorías desacoplada
- Feature flag remoto real (no solo visual)
- Arquitectura reactiva mantenible
- Optimización de Change Detection
- Preparación para compilación híbrida (Android / iOS)

El foco no fue únicamente agregar funcionalidad, sino garantizar:

- Escalabilidad
- Aislamiento de responsabilidades
- Control dinámico de features
- Rendimiento consistente

---

## Funcionalidades Implementadas

### 1. Gestión de Tareas

- Crear tareas
- Marcar como completadas
- Eliminar tareas
- Persistencia local mediante Ionic Storage
- Actualización reactiva del estado

### 2. Gestión de Categorías (Feature Controlada)

- CRUD completo de categorías
- Asociación tarea → categoría
- Filtrado reactivo por categoría
- Protección de rutas si la feature está deshabilitada

### 3. Feature Flag Remoto (`ff_categories`)

Control dinámico de la funcionalidad mediante Firebase Remote Config.

- Inicialización asíncrona segura
- Servicio centralizado de flags
- Protección de ruta con `canMatch`
- UI adaptativa según estado del flag
- No se instancia la feature si está deshabilitada

---

## Arquitectura

    src/
    ├── core/
    │   ├── models/
    │   ├── services/
    ├── features/
    │   ├── tasks/
    │   ├── categories/

### Principios Aplicados

- Componentes Standalone
- Separación dominio / infraestructura
- Servicios con estado reactivo (`BehaviorSubject`)
- ViewModel observable (`vm$`)
- ChangeDetectionStrategy.OnPush
- Control Flow moderno (`@if`, `@for`)
- Guards de ruta (`canMatch`)
- Inmutabilidad en actualizaciones de estado

---

## Decisiones Técnicas Clave

### Feature Flag implementado de forma estructural

La activación/desactivación no se limita a la UI:

- La ruta no es accesible.
- El módulo no se carga.
- El servicio no se inicializa.
- No existen referencias inconsistentes.

---

### Manejo Reactivo del Estado

Cada feature mantiene su estado interno mediante `BehaviorSubject`:

- Emite snapshots inmutables.
- Evita mutaciones directas.
- Facilita migración futura a NgRx o Signal Store.

---

### Optimización de Rendimiento

- `ChangeDetectionStrategy.OnPush`
- Lazy Loading por dominio
- Filtrado en memoria sobre snapshots
- Configuración de `minimumFetchIntervalMillis` en Remote Config
- Uso de `trackBy` en listas

---

## Instalación

```bash
npm install
ionic serve
```

---

## Compilación Híbrida (Cordova)

### Android

```bash
ionic build
cordova platform add android
cordova build android --release
```

APK generado en:

    cordova/platforms/android/app/build/outputs/apk/release/

---

### iOS (macOS requerido)

```bash
cordova platform add ios
cordova build ios --release
```

---

## Respuestas Técnicas Preparadas

### ¿Cuál fue el principal reto?

Diseñar una feature flag que desactive completamente la funcionalidad,
no solo elementos visuales.\
Se implementó control estructural mediante guard de ruta, servicio
centralizado e inicialización controlada.

---

### ¿Qué optimizaciones aplicaste?

- OnPush para reducir ciclos de change detection.
- Lazy loading por dominio.
- Estado reactivo con snapshots inmutables.
- Control de fetch en Firebase para evitar peticiones excesivas.
- TrackBy en listas.

---

### ¿Cómo garantizaste mantenibilidad?

- Separación clara por dominios.
- Servicios con responsabilidad única.
- Tipado estricto.
- Arquitectura reactiva predecible.
- Evitar lógica de negocio en componentes.
