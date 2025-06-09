// Re-exportar desde el nuevo gestor para mantener compatibilidad
import gestorSocket from './gestorSocket';

// Mantener exports existentes para compatibilidad temporal
export const socket = {
  get connected() {
    return gestorSocket.estaConectado();
  },
  
  emit: (evento: string, datos?: any) => {
    gestorSocket.emitir(evento, datos);
  },
  
  on: (evento: string, callback: Function) => {
    return gestorSocket.on(evento, callback);
  },
  
  off: (evento: string, callback: Function) => {
    gestorSocket.off(evento, callback);
  },
  
  connect: () => {
    gestorSocket.conectar();
  },
  
  disconnect: () => {
    gestorSocket.desconectar();
  }
};

export const conectarSocketConAuth = async () => {
  return await gestorSocket.conectar();
};

export const desconectarSocket = () => {
  gestorSocket.desconectar();
};

// Exportar el gestor para uso directo
export { gestorSocket };