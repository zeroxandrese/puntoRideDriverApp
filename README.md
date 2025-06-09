# PuntoRide Driver App 🚗

Aplicación móvil para conductores de la plataforma PuntoRide, desarrollada con React Native.

## 📱 Descripción

PuntoRide Driver es la aplicación oficial para conductores que permite:
- Recibir y gestionar solicitudes de viaje en tiempo real
- Navegación integrada hasta el punto de recogida y destino
- Seguimiento de ganancias e historial de viajes
- Comunicación en tiempo real con pasajeros
- Gestión de estado del vehículo (carro/moto)

## 🚀 Características Principales

- **Autenticación Segura**: Login con email y contraseña usando almacenamiento seguro (Keychain)
- **Tracking en Tiempo Real**: Actualización de ubicación cada 7 segundos
- **Conexión WebSocket Estable**: Sistema robusto de reconexión automática
- **Gestión Offline**: Cola de mensajes para enviar cuando se recupere la conexión
- **Notificaciones Push**: Alertas de nuevos viajes disponibles
- **Modo Carga**: Opción para transportar paquetes

## 🛠️ Tecnologías

- **React Native** 0.76.5
- **TypeScript** para type safety
- **Zustand** para gestión de estado
- **Socket.io** para comunicación en tiempo real
- **React Native Maps** para mapas y navegación
- **React Native Keychain** para almacenamiento seguro
- **React Navigation** para navegación entre pantallas

## 📋 Requisitos Previos

- Node.js >= 18
- npm o yarn
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS)
- Cocoapods (para iOS)

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-repo/puntoRideDriverApp.git
cd puntoRideDriverApp
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con las siguientes variables:
```
API_URL=https://api.puntoride.com
API_URL_SOCKET=wss://socket.puntoride.com
```

4. Instalar pods (solo iOS):
```bash
cd ios && pod install
```

## 🏃‍♂️ Ejecución

### Android
```bash
npm run android
# o
yarn android
```

### iOS
```bash
npm run ios
# o
yarn ios
```

### Metro Bundler
```bash
npm start
# o
yarn start
```

## 📱 Estructura del Proyecto

```
puntoRideDriverApp/
├── src/
│   ├── actions/          # Acciones de ubicación y permisos
│   ├── apiConfig/        # Configuración de API y interceptores
│   ├── assets/           # Imágenes y SVGs
│   ├── components/       # Componentes reutilizables
│   ├── context/          # Contextos de React (Socket)
│   ├── globalState/      # Estado global con Zustand
│   ├── hooks/            # Custom hooks
│   ├── interface/        # Interfaces TypeScript
│   ├── screen/           # Pantallas de la aplicación
│   ├── stacks/           # Navegación
│   ├── store/            # Stores de Zustand
│   ├── theme/            # Estilos globales
│   └── utils/            # Utilidades y servicios
├── android/              # Código nativo Android
├── ios/                  # Código nativo iOS
└── App.tsx              # Componente principal
```

## 🔐 Seguridad

- Tokens almacenados en Keychain (iOS) / Keystore (Android)
- Autenticación en todas las conexiones WebSocket
- Renovación automática de tokens
- Logs seguros sin información sensible

## 🐛 Debugging

### Logs
La aplicación incluye un sistema de logging completo:
```typescript
import servicioLogger from './utils/servicioLogger';

// Diferentes niveles de log
servicioLogger.debug('Mensaje debug');
servicioLogger.info('Información');
servicioLogger.warn('Advertencia');
servicioLogger.error('Error', error);
```

### Estado de Conexión
Indicador visual del estado de la conexión WebSocket en la parte superior de la pantalla.

### React Native Debugger
```bash
# Instalar
brew install react-native-debugger

# Ejecutar
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

## 📦 Build para Producción

### Android
```bash
cd android
./gradlew assembleRelease
```

El APK se generará en `android/app/build/outputs/apk/release/`

### iOS
1. Abrir el proyecto en Xcode
2. Seleccionar "Generic iOS Device"
3. Product → Archive

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Con coverage
npm test -- --coverage
```

## 📈 Monitoreo

La aplicación está preparada para integrarse con servicios de monitoreo como:
- Sentry para reporte de errores
- Firebase Analytics para métricas
- Crashlytics para crashes

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📞 Soporte

Para soporte técnico, contactar:
- Email: soporte@puntoride.com
- Teléfono: +XX XXX XXX XXXX

## 📄 Licencia

Este proyecto es privado y propiedad de PuntoRide. Todos los derechos reservados.
