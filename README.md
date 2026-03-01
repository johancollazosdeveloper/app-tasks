# Prueba Técnica – Aplicación de Tareas

Ionic + Angular (Standalone) + Firebase Remote Config

Aplicación híbrida desarrollada con Ionic y Angular que permite la gestión de tareas con categorización, persistencia local y control dinámico de funcionalidades mediante Firebase Remote Config.

---

## Objetivo

Extender una aplicación base de tareas incorporando:

- Gestión de categorías
- Feature flag remoto
- Optimización de rendimiento
- Configuración para compilación Android e iOS
- Buenas prácticas de arquitectura y mantenibilidad

---

## Funcionalidades

### Gestión de tareas

- Crear tareas
- Marcar como completadas
- Eliminar tareas
- Persistencia local con Ionic Storage

### Categorías

- Crear, editar y eliminar categorías
- Asignar categoría a una tarea
- Filtrar tareas por categoría

### Feature Flag (Firebase Remote Config)

- Activación/desactivación remota de la funcionalidad de categorías
- Adaptación dinámica de UI y navegación

---

## Arquitectura

Estructura modular por dominios:

src/
├── core/
│ ├── models/
│ ├── services/
├── features/
│ ├── tasks/
│ ├── categories/

### Principios aplicados

- Componentes Standalone (Angular moderno)
- Separación clara entre lógica y presentación
- Servicios reactivos con `BehaviorSubject`
- ViewModel reactivo (`vm$`)
- ChangeDetectionStrategy.OnPush
- Control Flow moderno (`@if`, `@for`)

---

## Tecnologías

- Ionic 7+
- Angular (Standalone)
- RxJS
- Ionic Storage
- Firebase Remote Config
- Cordova (Android / iOS)

---

## Requisitos

- Node.js LTS
- Ionic CLI
- Android Studio
- JDK 17 (requerido para build Android)
- macOS + Xcode (para IPA)

---

## Instalación y ejecución (Web)

```bash
npm install
ionic serve
```
