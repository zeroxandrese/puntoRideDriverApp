import { io, Socket } from 'socket.io-client';
import { API_URL_SOCKET } from '@env';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { AppState, AppStateStatus } from 'react-native';
import servicioLogger from './servicioLogger';
import almacenamientoSeguro from './almacenamientoSeguro';

export type EstadoConexion = 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting';

interface MensajePendiente {
  evento: string;
  datos: any;
  timestamp: number;
  intentos: number;
}

interface OpcionesReconexion {
  maxIntentos: number;
  retrasoinicial: number;
  retrasoMaximo: number;
  factorMultiplicador: number;
}

class GestorSocket {
  private socket: Socket | null = null;
  private estadoConexion: EstadoConexion = 'disconnected';
  private listeners: Map<string, Set<Function>> = new Map();
  private colaOffline: MensajePendiente[] = [];
  private intentosReconexion = 0;
  private timerReconexion: NodeJS.Timeout | null = null;
  private suscripcionRed: (() => void) | null = null;
  private suscripcionApp: any = null;
  private ultimaConexionExitosa = 0;
  private tokenActual: string | null = null;

  private readonly opcionesReconexion: OpcionesReconexion = {
    maxIntentos: 10,
    retrasoinicial: 1000,
    retrasoMaximo: 30000,
    factorMultiplicador: 1.5
  };

  constructor() {
    this.inicializarMonitores();
  }

  private inicializarMonitores() {
    // Monitor de estado de red
    this.suscripcionRed = NetInfo.addEventListener(this.manejarCambioRed);

    // Monitor de estado de la app
    this.suscripcionApp = AppState.addEventListener('change', this.manejarCambioApp);
  }

  private manejarCambioRed = (estado: NetInfoState) => {
    servicioLogger.info('Cambio de estado de red', { 
      conectado: estado.isConnected,
      tipo: estado.type 
    });

    if (estado.isConnected && this.estadoConexion === 'disconnected') {
      this.reconectar();
    } else if (!estado.isConnected && this.socket?.connected) {
      this.desconectar();
    }
  };

  private manejarCambioApp = (nuevoEstado: AppStateStatus) => {
    if (nuevoEstado === 'active' && this.estadoConexion === 'disconnected') {
      servicioLogger.info('App activa, verificando conexión socket');
      this.reconectar();
    } else if (nuevoEstado === 'background') {
      servicioLogger.info('App en background, manteniendo conexión mínima');
    }
  };

  async conectar(): Promise<boolean> {
    try {
      // Verificar si ya está conectado
      if (this.socket?.connected) {
        servicioLogger.info('Socket ya conectado');
        return true;
      }

      // Obtener token actualizado
      this.tokenActual = await almacenamientoSeguro.obtenerToken();
      if (!this.tokenActual) {
        servicioLogger.error('No se puede conectar sin token');
        this.cambiarEstado('error');
        return false;
      }

      // Crear socket si no existe
      if (!this.socket) {
        this.socket = io(API_URL_SOCKET, {
          transports: ['websocket'],
          reconnection: false, // Manejamos reconexión manualmente
          timeout: 10000,
          auth: {
            token: this.tokenActual
          }
        });

        this.configurarEventosSocket();
      } else {
        // Actualizar token en socket existente
        this.socket.auth = { token: this.tokenActual };
      }

      this.cambiarEstado('connecting');
      this.socket.connect();

      // Esperar conexión con timeout
      return await this.esperarConexion(10000);
    } catch (error) {
      servicioLogger.error('Error al conectar socket', error);
      this.cambiarEstado('error');
      return false;
    }
  }

  private configurarEventosSocket() {
    if (!this.socket) return;

    // Eventos de conexión
    this.socket.on('connect', () => {
      servicioLogger.info('Socket conectado exitosamente', {
        id: this.socket?.id,
        transport: this.socket?.io.engine.transport.name
      });

      this.ultimaConexionExitosa = Date.now();
      this.intentosReconexion = 0;
      this.cambiarEstado('connected');
      this.procesarColaOffline();
      this.emitirEvento('socket:connected');
    });

    this.socket.on('disconnect', (razon) => {
      servicioLogger.warn('Socket desconectado', { razon });
      this.cambiarEstado('disconnected');
      this.emitirEvento('socket:disconnected', razon);
      
      // Reconectar automáticamente si no fue desconexión manual
      if (razon !== 'io client disconnect') {
        this.programarReconexion();
      }
    });

    this.socket.on('connect_error', (error) => {
      servicioLogger.error('Error de conexión socket', error);
      this.cambiarEstado('error');
      this.emitirEvento('socket:error', error);
    });

    // Evento personalizado para errores de autenticación
    this.socket.on('auth_error', async (error) => {
      servicioLogger.error('Error de autenticación socket', error);
      
      // Intentar renovar token
      const nuevoToken = await almacenamientoSeguro.obtenerToken();
      if (nuevoToken && nuevoToken !== this.tokenActual) {
        this.tokenActual = nuevoToken;
        this.reconectar();
      } else {
        this.cambiarEstado('error');
        this.emitirEvento('socket:auth_error', error);
      }
    });

    // Ping/Pong personalizado para mantener conexión
    this.socket.on('ping', () => {
      this.socket?.emit('pong');
    });
  }

  private esperarConexion(timeout: number): Promise<boolean> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve(false);
      }, timeout);

      const verificar = () => {
        if (this.socket?.connected) {
          clearTimeout(timer);
          resolve(true);
        } else if (this.estadoConexion === 'error') {
          clearTimeout(timer);
          resolve(false);
        } else {
          setTimeout(verificar, 100);
        }
      };

      verificar();
    });
  }

  private programarReconexion() {
    if (this.timerReconexion) {
      clearTimeout(this.timerReconexion);
    }

    const retraso = this.calcularRetrasoReconexion();
    servicioLogger.info(`Programando reconexión en ${retraso}ms`);

    this.timerReconexion = setTimeout(() => {
      this.reconectar();
    }, retraso);
  }

  private calcularRetrasoReconexion(): number {
    const { retrasoinicial, retrasoMaximo, factorMultiplicador } = this.opcionesReconexion;
    const retraso = Math.min(
      retrasoinicial * Math.pow(factorMultiplicador, this.intentosReconexion),
      retrasoMaximo
    );
    return retraso + Math.random() * 1000; // Añadir jitter
  }

  async reconectar() {
    if (this.estadoConexion === 'connecting' || this.estadoConexion === 'reconnecting') {
      servicioLogger.info('Ya hay un intento de conexión en progreso');
      return;
    }

    this.intentosReconexion++;
    
    if (this.intentosReconexion > this.opcionesReconexion.maxIntentos) {
      servicioLogger.error('Máximo de intentos de reconexión alcanzado');
      this.cambiarEstado('error');
      this.emitirEvento('socket:max_reconnect_attempts');
      return;
    }

    this.cambiarEstado('reconnecting');
    
    // Verificar conectividad de red antes de intentar
    const estadoRed = await NetInfo.fetch();
    if (!estadoRed.isConnected) {
      servicioLogger.warn('Sin conexión a internet, posponiendo reconexión');
      this.cambiarEstado('disconnected');
      return;
    }

    const conectado = await this.conectar();
    
    if (!conectado) {
      this.programarReconexion();
    }
  }

  desconectar() {
    if (this.timerReconexion) {
      clearTimeout(this.timerReconexion);
      this.timerReconexion = null;
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.cambiarEstado('disconnected');
    this.intentosReconexion = 0;
  }

  // Emisión de eventos con cola offline
  emitir(evento: string, datos?: any): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.socket?.connected) {
        this.socket.emit(evento, datos, (ack: any) => {
          servicioLogger.debug(`Evento emitido: ${evento}`, { datos, ack });
          resolve(true);
        });
      } else {
        // Agregar a cola offline
        this.agregarAColaOffline(evento, datos);
        servicioLogger.warn(`Evento agregado a cola offline: ${evento}`);
        resolve(false);
      }
    });
  }

  private agregarAColaOffline(evento: string, datos: any) {
    this.colaOffline.push({
      evento,
      datos,
      timestamp: Date.now(),
      intentos: 0
    });

    // Limitar tamaño de cola
    if (this.colaOffline.length > 100) {
      this.colaOffline.shift();
    }
  }

  private async procesarColaOffline() {
    if (this.colaOffline.length === 0) return;

    servicioLogger.info(`Procesando ${this.colaOffline.length} mensajes offline`);

    const mensajesPendientes = [...this.colaOffline];
    this.colaOffline = [];

    for (const mensaje of mensajesPendientes) {
      // Descartar mensajes muy antiguos (más de 5 minutos)
      if (Date.now() - mensaje.timestamp > 5 * 60 * 1000) {
        continue;
      }

      mensaje.intentos++;
      
      const enviado = await this.emitir(mensaje.evento, mensaje.datos);
      
      if (!enviado && mensaje.intentos < 3) {
        // Reagregar a la cola si falla
        this.colaOffline.push(mensaje);
      }
    }
  }

  // Registro de listeners con limpieza automática
  on(evento: string, callback: Function) {
    if (!this.listeners.has(evento)) {
      this.listeners.set(evento, new Set());
    }

    this.listeners.get(evento)!.add(callback);

    // Si es un evento de socket, registrarlo
    if (!evento.startsWith('socket:') && this.socket) {
      this.socket.on(evento, callback as any);
    }

    // Retornar función de limpieza
    return () => this.off(evento, callback);
  }

  off(evento: string, callback: Function) {
    const callbacks = this.listeners.get(evento);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.listeners.delete(evento);
      }
    }

    // Remover del socket también
    if (!evento.startsWith('socket:') && this.socket) {
      this.socket.off(evento, callback as any);
    }
  }

  private emitirEvento(evento: string, datos?: any) {
    const callbacks = this.listeners.get(evento);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(datos);
        } catch (error) {
          servicioLogger.error(`Error en callback de evento ${evento}`, error);
        }
      });
    }
  }

  private cambiarEstado(nuevoEstado: EstadoConexion) {
    if (this.estadoConexion !== nuevoEstado) {
      const estadoAnterior = this.estadoConexion;
      this.estadoConexion = nuevoEstado;
      this.emitirEvento('socket:state_change', { anterior: estadoAnterior, actual: nuevoEstado });
    }
  }

  // Getters públicos
  obtenerEstado(): EstadoConexion {
    return this.estadoConexion;
  }

  estaConectado(): boolean {
    return this.socket?.connected || false;
  }

  obtenerSocketId(): string | undefined {
    return this.socket?.id;
  }

  // Limpieza
  destruir() {
    this.desconectar();
    
    if (this.suscripcionRed) {
      this.suscripcionRed();
    }
    
    if (this.suscripcionApp) {
      this.suscripcionApp.remove();
    }

    this.listeners.clear();
    this.colaOffline = [];
  }
}

// Singleton
export default new GestorSocket();