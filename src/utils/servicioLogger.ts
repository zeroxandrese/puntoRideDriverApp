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

const MAX_LOGS = 100;
const isDevelopment = __DEV__;
let logs: LogEntry[] = [];

const getDeviceInfo = async () => {
  try {
    return {
      platform: Platform.OS,
      version: Platform.Version.toString(),
      model: await DeviceInfo.getModel(),
      appVersion: DeviceInfo.getVersion(),
    };
  } catch {
    return {
      platform: Platform.OS,
      version: Platform.Version.toString(),
      model: 'Unknown',
      appVersion: 'Unknown',
    };
  }
};

const createLogEntry = (
  level: LogLevel,
  message: string,
  context?: any,
  error?: Error
): LogEntry => ({
  timestamp: new Date().toISOString(),
  level,
  message,
  context,
  stackTrace: error?.stack,
});

const sendToRemoteService = async (entry: LogEntry) => {
  try {
    const deviceInfo = await getDeviceInfo();
    const enrichedEntry = { ...entry, deviceInfo };
    // TODO: Implementar envío a servicio remoto (e.g., Sentry, Crashlytics)
    // await apiConfig.post('/logs', enrichedEntry);
  } catch {
    // Fallar silenciosamente
  }
};

const log = (entry: LogEntry) => {
  logs.push(entry);
  if (logs.length > MAX_LOGS) logs.shift();

  if (isDevelopment) {
    const logMethod =
      entry.level === 'error' || entry.level === 'fatal'
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

  if (!isDevelopment && (entry.level === 'error' || entry.level === 'fatal')) {
    sendToRemoteService(entry);
  }
};

export const servicioLogger = {
  debug: (message: string, context?: any) => log(createLogEntry('debug', message, context)),
  info: (message: string, context?: any) => log(createLogEntry('info', message, context)),
  warn: (message: string, context?: any) => log(createLogEntry('warn', message, context)),
  error: (message: string, error?: Error | any, context?: any) => {
    const err = error instanceof Error ? error : new Error(String(error));
    log(createLogEntry('error', message, context, err));
  },
  fatal: (message: string, error?: Error | any, context?: any) => {
    const err = error instanceof Error ? error : new Error(String(error));
    log(createLogEntry('fatal', message, context, err));
  },
  getLogs: (level?: LogLevel): LogEntry[] =>
    level ? logs.filter((log) => log.level === level) : [...logs],
  clearLogs: () => {
    logs = [];
  },
  logApiError: (endpoint: string, error: any, context?: any) => {
    const message = `Error en API: ${endpoint}`;
    const errorContext = {
      endpoint,
      ...context,
      response: error.response?.data,
      status: error.response?.status,
    };
    servicioLogger.error(message, error, errorContext);
  },
  logSocketError: (event: string, error: any, context?: any) => {
    const message = `Error en Socket: ${event}`;
    const errorContext = { event, ...context };
    servicioLogger.error(message, error, errorContext);
  },
};

export default servicioLogger;
