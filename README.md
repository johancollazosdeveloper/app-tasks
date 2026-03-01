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

---

## Compilación para Android e iOS (Cordova)

La aplicación está preparada para compilación híbrida mediante Cordova.

Antes de compilar, generar el build web:

- ionic build

Copiar el resultado del build a:

cordova/www/

### Android (Generación de APK)

Desde la carpeta cordova:

- cordova platform add android
- cordova build android

Para generar APK en modo release:

- cordova build android --release

Ruta del APK generado:

cordova/platforms/android/app/build/outputs/apk/release/

### iOS (Generación de IPA)

Requiere macOS con Xcode instalado.

Desde la carpeta cordova:

- cordova platform add ios
- cordova build ios

Para generar archivo IPA firmado:

- cordova build ios --release
