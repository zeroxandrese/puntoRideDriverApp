// Interfaces para manejo de errores

export interface ErrorAPI {
  response?: {
    data?: {
      msg?: string;
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
  code?: string;
}

export interface EventoTripAsignado {
  trip: {
    _id: string;
    status: string;
    polylineRoute?: string;
    [key: string]: any;
  };
  vehicle: {
    _id: string;
    licensePlate: string;
    model: string;
    type: string;
    [key: string]: any;
  };
  client: {
    _id: string;
    name: string;
    phone?: string;
    email?: string;
    [key: string]: any;
  };
}

export interface ModalVisibilidad {
  visibility: boolean;
  message: string;
  timeout?: number;
}

export interface ComentarioTrip {
  _id: string;
  comment: string;
  rating: number;
  createdAt: string;
  user?: {
    name: string;
    email?: string;
  };
}

// Función helper para obtener mensaje de error
export function obtenerMensajeError(error: ErrorAPI): string {
  return error.response?.data?.msg || 
         error.response?.data?.message || 
         error.response?.data?.error || 
         error.message || 
         "Error desconocido";
}