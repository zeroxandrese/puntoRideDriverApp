import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
  stackTrace?: string;
  deviceInfo?: {
    platform: string;
    version: string;
    model: string;
    appVersion: string;
  };
}

class ServicioLogger {
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 100;
  private isDevelopment = __DEV__;

  private async getDeviceInfo() {
    try {
      return {
        platform: Platform.OS,
        version: Platform.Version.toString(),
        model: await DeviceInfo.getModel(),
        appVersion: DeviceInfo.getVersion()
      };
    } catch {
      return {
        platform: Platform.OS,
        version: Platform.Version.toString(),
        model: 'Unknown',
        appVersion: 'Unknown'
      };
    }
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: any,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      stackTrace: error?.stack
    };
  }

  private log(entry: LogEntry) {
    // Almacenar en memoria
    this.logs.push(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }

    // Mostrar en consola en desarrollo
    if (this.isDevelopment) {
      const logMethod = entry.level === 'error' || entry.level === 'fatal' 
        ? console.error 
        : entry.level === 'warn' 
        ? console.warn 
        : console.log;

      logMethod(
        `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`,
        entry.context || '',
        entry.stackTrace || ''
      );
    }

    // En producción, enviar errores críticos a servicio externo
    if (!this.isDevelopment && (entry.level === 'error' || entry.level === 'fatal')) {
      this.sendToRemoteService(entry);
    }
  }

  private async sendToRemoteService(entry: LogEntry) {
    try {
      // Aquí se podría integrar con servicios como Sentry, Crashlytics, etc.
      // Por ahora solo preparamos la estructura
      const deviceInfo = await this.getDeviceInfo();
      const enrichedEntry = { ...entry, deviceInfo };
      
      // TODO: Implementar envío a servicio remoto
      // await apiConfig.post('/logs', enrichedEntry);
    } catch {
      // Fallar silenciosamente para no causar más errores
    }
  }

  debug(message: string, context?: any) {
    this.log(this.createLogEntry('debug', message, context));
  }

  info(message: string, context?: any) {
    this.log(this.createLogEntry('info', message, context));
  }

  warn(message: string, context?: any) {
    this.log(this.createLogEntry('warn', message, context));
  }

  error(message: string, error?: Error | any, context?: any) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log(this.createLogEntry('error', message, context, errorObj));
  }

  fatal(message: string, error?: Error | any, context?: any) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log(this.createLogEntry('fatal', message, context, errorObj));
  }

  // Obtener logs para debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  // Limpiar logs
  clearLogs() {
    this.logs = [];
  }

  // Método helper para errores de API
  logApiError(endpoint: string, error: any, context?: any) {
    const message = `Error en API: ${endpoint}`;
    const errorContext = {
      endpoint,
      ...context,
      response: error.response?.data,
      status: error.response?.status
    };
    this.error(message, error, errorContext);
  }

  // Método helper para errores de Socket
  logSocketError(event: string, error: any, context?: any) {
    const message = `Error en Socket: ${event}`;
    const errorContext = {
      event,
      ...context
    };
    this.error(message, error, errorContext);
  }
}

export default new ServicioLogger();