import { useEffect, useRef } from "react";
import haversine from 'haversine-distance';

import { useLocationStore } from '../store/location/locationStore';
import { Location } from '../interface/interface';
import { useServiceBusinessStore } from "../store/business/useServiceBusiness";
import useAuthStore from '../globalState/globalState';
import { useSocket } from '../context/SocketContext';
import servicioLogger from '../utils/servicioLogger';

const useSendLocation = () => {

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastLocationRef = useRef<Location | null>(null);
    const { getLocation } = useLocationStore();
    const { postSendLocation } = useServiceBusinessStore();
    const { user } = useAuthStore();
    const { conectado } = useSocket();

   useEffect(() => {
        if (!user) return;

        const sendLocation = async () => {
            try {
                // Solo enviar si el socket está conectado
                if (!conectado) {
                    servicioLogger.debug('Socket no conectado, omitiendo envío de ubicación');
                    return;
                }

                const location = await getLocation();
                if (!location) return;

                const lastLocation = lastLocationRef.current;
                const distance = lastLocation ? haversine(lastLocation, location) : Infinity;
                
                // Solo enviar si se movió más de 10 metros
                if (lastLocation && distance < 10) {
                    servicioLogger.debug('Ubicación no ha cambiado significativamente', { distance });
                    return;
                }

                lastLocationRef.current = location;
                await postSendLocation(location.latitude, location.longitude);
                servicioLogger.debug('Ubicación enviada', { location, distance });
            } catch (err) {
                servicioLogger.error('Error enviando ubicación', err);
            }
        };

        sendLocation();
        // Actualizar ubicación cada 7 segundos (optimización de 25s a 7s)
        intervalRef.current = setInterval(sendLocation, 7000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [user, conectado, getLocation, postSendLocation]);
};

export default useSendLocation;