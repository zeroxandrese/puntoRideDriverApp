import { useEffect, useRef } from "react";
import haversine from 'haversine-distance';

import { useLocationStore } from '../store/location/locationStore';
import { Location } from '../interface/interface';
import { useServiceBusinessStore } from "../store/business/useServiceBusiness";
import useAuthStore from '../globalState/globalState';

const useSendLocation = () => {

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastLocationRef = useRef<Location | null>(null);
    const { getLocation } = useLocationStore();
    const { postSendLocation } = useServiceBusinessStore();
    const { user } = useAuthStore();

   useEffect(() => {
        if (!user) return;

        const sendLocation = async () => {
            try {
                const location = await getLocation();
                if (!location) return;

                const lastLocation = lastLocationRef.current;
                if (lastLocation && haversine(lastLocation, location) < 10) return;

                lastLocationRef.current = location;
                postSendLocation(location.latitude, location.longitude);
            } catch (err) {
                console.error("Error enviando ubicación:", err);
            }
        };

        sendLocation();
        intervalRef.current = setInterval(sendLocation, 25000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [user]);
};

export default useSendLocation;