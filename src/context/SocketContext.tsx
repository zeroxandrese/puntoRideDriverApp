import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import gestorSocket, { EstadoConexion } from '../utils/gestorSocket';
import servicioLogger from '../utils/servicioLogger';
import useAuthStore from '../globalState/globalState';

interface SocketContextType {
  estadoConexion: EstadoConexion;
  conectado: boolean;
  socketId: string | undefined;
  conectar: () => Promise<boolean>;
  desconectar: () => void;
  emitir: (evento: string, datos?: any) => Promise<boolean>;
  suscribir: (evento: string, callback: Function) => () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket debe ser usado dentro de SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [estadoConexion, setEstadoConexion] = useState<EstadoConexion>('disconnected');
  const [conectado, setConectado] = useState(false);
  const [socketId, setSocketId] = useState<string | undefined>();
  const { user, status } = useAuthStore();
  const cleanupRefs = useRef<(() => void)[]>([]);

  // Manejar cambios de estado de conexión
  useEffect(() => {
    const cleanup = gestorSocket.on('socket:state_change', ({ actual }: { actual: EstadoConexion }) => {
      servicioLogger.info('Cambio de estado socket en contexto', { estado: actual });
      setEstadoConexion(actual);
      setConectado(actual === 'connected');
      setSocketId(actual === 'connected' ? gestorSocket.obtenerSocketId() : undefined);
    });

    cleanupRefs.current.push(cleanup);
    return cleanup;
  }, []);

  // Manejar autenticación y conexión inicial
  useEffect(() => {
    const manejarConexion = async () => {
      if (status === 'authenticated' && user?.uid) {
        servicioLogger.info('Usuario autenticado, conectando socket');
        const conectado = await gestorSocket.conectar();
        
        if (conectado) {
          // Registrar usuario en el servidor
          await gestorSocket.emitir('register-user', user.uid);
          await gestorSocket.emitir('join', user.uid);
        }
      } else if (status === 'not-authenticated') {
        servicioLogger.info('Usuario no autenticado, desconectando socket');
        gestorSocket.desconectar();
      }
    };

    manejarConexion();
  }, [status, user?.uid]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      cleanupRefs.current.forEach(cleanup => cleanup());
      gestorSocket.desconectar();
    };
  }, []);

  const conectar = useCallback(async () => {
    return await gestorSocket.conectar();
  }, []);

  const desconectar = useCallback(() => {
    gestorSocket.desconectar();
  }, []);

  const emitir = useCallback(async (evento: string, datos?: any) => {
    return await gestorSocket.emitir(evento, datos);
  }, []);

  const suscribir = useCallback((evento: string, callback: Function) => {
    const cleanup = gestorSocket.on(evento, callback);
    cleanupRefs.current.push(cleanup);
    return cleanup;
  }, []);

  const value: SocketContextType = {
    estadoConexion,
    conectado,
    socketId,
    conectar,
    desconectar,
    emitir,
    suscribir
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook personalizado para eventos de viaje
export const useSocketTrip = () => {
  const { suscribir, emitir } = useSocket();
  const [tripAsignado, setTripAsignado] = useState<any>(null);

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    // Suscribir a eventos de viaje
    cleanups.push(
      suscribir('trip_assigned', (data: any) => {
        servicioLogger.info('Viaje asignado recibido', data);
        setTripAsignado(data);
      })
    );

    cleanups.push(
      suscribir('trip_canceled', () => {
        servicioLogger.info('Viaje cancelado');
        setTripAsignado(null);
      })
    );

    return () => {
      cleanups.forEach(cleanup => cleanup());
    };
  }, [suscribir]);

  const confirmarViaje = useCallback(async (tripId: string) => {
    return await emitir('confirm-trip', { tripId });
  }, [emitir]);

  const rechazarViaje = useCallback(async (tripId: string) => {
    return await emitir('reject-trip', { tripId });
  }, [emitir]);

  return {
    tripAsignado,
    confirmarViaje,
    rechazarViaje
  };
};