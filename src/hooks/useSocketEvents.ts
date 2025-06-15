import { useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useServiceBusinessStore } from '../store/business/useServiceBusiness';
import Toast from 'react-native-toast-message';
import servicioLogger from '../utils/servicioLogger';
import { EventoTripAsignado } from '../interface/errores';
import { trip } from '../interface/interface';

interface Props {
  type: string;
  title: string;
  message: string;
  visibilityTime: number;
}

const showToast = ({ type, title, message, visibilityTime }: Props) => {
  Toast.show({
    type: type,
    text1: title,
    text2: message,
    visibilityTime: visibilityTime
  });
};

export const useSocketEvents = () => {
  const { suscribir } = useSocket();
  const cleanupRefs = useRef<(() => void)[]>([]);

  useEffect(() => {
    // Limpiar listeners anteriores
    cleanupRefs.current.forEach(cleanup => cleanup());
    cleanupRefs.current = [];

    // New comment
    cleanupRefs.current.push(
      suscribir('new-comment', (comment: any) => {
        servicioLogger.info('Evento: new-comment', { comment });
        
        const state = useServiceBusinessStore.getState();
        const prevComments = state.comments ?? [];
        
        useServiceBusinessStore.setState({ 
          comments: [...prevComments, comment] 
        });
      })
    );

    // Route accepted
    cleanupRefs.current.push(
      suscribir('client_route_accepted', ({ polyline, polylineType, positionDriverEvent }: any) => {
        servicioLogger.info('Evento: client_route_accepted');
        
        useServiceBusinessStore.setState({ 
          polyline, 
          polylineType, 
          positionDriverEvent 
        });
      })
    );

    // Trip canceled
    cleanupRefs.current.push(
      suscribir('trip_canceled', ({ tripId }: any) => {
        servicioLogger.info('Evento: trip_canceled', { tripId });
        
        useServiceBusinessStore.setState({
          tripCurrentVehicle: null,
          polyline: null,
          endTrip: true,
          tripCurrent: null,
          polylineType: "",
          tripCurrentClient: null,
          tripStarted: false,
          travelState: "idle",
          comments: []
        });

        showToast({
          type: "error",
          title: "Viaje cancelado",
          message: "El cliente canceló el viaje.",
          visibilityTime: 5000
        });
      })
    );

    // Cleanup function
    return () => {
      servicioLogger.info('Limpiando listeners de socket events');
      cleanupRefs.current.forEach(cleanup => cleanup());
      cleanupRefs.current = [];
    };
  }, [suscribir]);
};