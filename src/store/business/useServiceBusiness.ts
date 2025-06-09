import { create } from "zustand";
import Toast from 'react-native-toast-message';

import {
    tripPostResponse, Users,
    vehicle, contactUsResponse, tripsHistoryResponse,
    Comments, LatLng, SurveyResponse, trip,
    responseTripActive, tripsAvailableResponse, tripsAcceptedResponse
} from '../../interface/interface';
import apiConfig from "../../apiConfig/apiConfig";
import { ErrorAPI, obtenerMensajeError, EventoTripAsignado } from '../../interface/errores';

type TravelState = 'idle' | 'sending' | 'in_progress';

interface BusinessState {
    tripsHistory: tripsHistoryResponse[] | null;
    comments: Comments[] | null;
    travelState: TravelState;
    tripCurrent: trip | null;
    tripsAvailable: trip[] | null;
    tripCurrentVehicle: vehicle | null;
    tripCurrentClient: Users | null;
    polyline: { latitude: number; longitude: number }[] | null;
    positionDriverEvent: LatLng | null;
    tripStarted: boolean;
    endTrip: boolean | null;
    polylineType: string;
    message: string;
    errorMessage: string;
    removeSocketListeners: () => void;
    getHistoryTrip: () => Promise<void>;
    postContactUs: (comment: string) => Promise<void>;
    postAcceptedTrip: (id: string) => Promise<void>;
    postDriverArrived: (id: string) => Promise<void>;
    postTripEnd: (id: string) => Promise<void>;
    postTripStarted: (id: string) => Promise<void>;
    tripRejected: (id: string) => Promise<void>;
    postCancelTrip: (id: string) => Promise<void>;
    postCommentsTrip: (comment: string, id: string) => Promise<void>;
    getCommentsTrip: (id: string) => Promise<void>;
    postSendLocation: (latitude: number, longitude: number) => Promise<void>;
    getActiveTrip: () => Promise<void>;
    getTripAvailable: () => Promise<void>;
    getVehicle: () => Promise<void>;
    postSurvey: (id: string, feeback: string, score: number) => Promise<void>;
    set: (state: Partial<BusinessState>) => void;
};

interface Props {
    type: string;
    title: string;
    message: string;
    visibilityTime: number;
};

const showToast = ({ type, title, message, visibilityTime }: Props) => {
    Toast.show({
        type: type,
        text1: title,
        text2: message,
        visibilityTime: visibilityTime
    });
};

export const useServiceBusinessStore = create<BusinessState>()((set, get) => ({
    tripsHistory: null,
    tripCurrent: null,
    tripCurrentVehicle: null,
    travelState: 'idle',
    tripCurrentClient: null,
    tripsAvailable: null,
    comments: [],
    polyline: null,
    polylineType: "",
    positionDriverEvent: null,
    tripStarted: false,
    endTrip: null,
    errorMessage: "",
    message: "",
    set: (state) => set(state),

    // Socket listeners ahora manejados por useSocketEvents hook
    removeSocketListeners: () => {
        // Deprecado: ahora se maneja en useSocketEvents
    },

    tripRejected: async (
        id
    ) => {

        try {

            await apiConfig.post(`/tripCalculate/${id}`);

        } catch (error) {
            set({
                errorMessage: (error as ErrorAPI).response?.data?.msg || "Error al calcular el viaje"
            });
        }
    },

    postContactUs: async (comment: string) => {

        try {

            const { data } = await apiConfig.post<contactUsResponse>(`/contactUs/driver/`, { comment });

            // Validar si la respuesta es un error
            if (data.usersDriverId !== "") {
                showToast({
                    type: "success",
                    title: "¡Mensaje enviado!",
                    message: "Gracias por contactarnos. Te responderemos pronto.",
                    visibilityTime: 6000
                });

                return;
            };

        } catch (error) {
            set({ errorMessage: (error as ErrorAPI).response?.data?.msg || "Error al comentar" });
        }
    },

    getHistoryTrip: async () => {

        try {
            const { data } = await apiConfig.get<tripsHistoryResponse[]>(`/historyTripsDriver/`);

            set({
                tripsHistory: data
            });

        } catch (error) {
            set({ errorMessage: (error as ErrorAPI).response?.data?.msg || "Error al comentar" });
        }
    },

    postSurvey: async (id: string, feedback: string, score: number) => {

        try {
            await apiConfig.post<SurveyResponse>(`/surveys/driversSurveys/${id}`, { feedback, score });

        } catch (error) {
            set({ errorMessage: (error as ErrorAPI).response?.data?.msg || "Error al comentar" });
        }
    },

    postCancelTrip: async (id: string) => {

        try {

            const data = await apiConfig.post<tripPostResponse>(`/cancelTrip/clientCancelTrip/${id}`);

            if (!data.data) {
                return
            }

            showToast({
                type: "success",
                title: "¡Viaje Cancelado!",
                message: "Tu viaje ha sido cancelado.",
                visibilityTime: 6000
            });

            set({
                tripCurrentVehicle: null,
                tripCurrentClient: null,
                tripCurrent: null,
                polyline: null,
                polylineType: "",
                positionDriverEvent: null,
                travelState: "idle"
            });

        } catch (error) {
            set({ errorMessage: (error as ErrorAPI).response?.data?.msg || "Error al comentar" });
        }
    },

    getActiveTrip: async () => {

        try {

            const data = await apiConfig.get<responseTripActive>(`/trip/`);

            if (!data.data.response) {
                return;
            }

            if (data.data.response.tripStarted === true) {
                set({
                    tripStarted: true,
                    travelState: "in_progress",
                    tripCurrent: data.data.response,
                    tripCurrentVehicle: data.data.vehicleData,
                    tripCurrentClient: data.data.userData
                });
                return
            }

            set({
                travelState: "sending",
                tripCurrent: data.data.response,
                tripCurrentVehicle: data.data.vehicleData,
                tripCurrentClient: data.data.userData
            });


        } catch (error) {
            set({ errorMessage: (error as ErrorAPI).response?.data?.msg || "Error al comentar" });
        }
    },
    postCommentsTrip: async (comment: string, id: string) => {

        try {
            console.log("paso desde el mensaje")
            await apiConfig.post<Comments[]>(`/commentDriver/${id}`, { comment });

        } catch (error) {
            set({ errorMessage: (error as ErrorAPI).response?.data?.msg || "Error al comentar" });
        }
    },

    getCommentsTrip: async (id: string) => {

        try {
            const { data } = await apiConfig.get<Comments[]>(`/commentDriver/${id}`);

            set({
                comments: data
            });

        } catch (error) {
            set({ errorMessage: (error as ErrorAPI).response?.data?.msg || "Error al comentar" });
        }
    },

    getTripAvailable: async () => {

        try {

            const { data } = await apiConfig.get<tripsAvailableResponse>(`/trip/available`);

            set({
                tripsAvailable: data.trips
            });

        } catch (error) {
            set({ errorMessage: (error as ErrorAPI).response?.data?.msg || "Error al comentar" });
        }
    },

    postAcceptedTrip: async (id: string) => {

        try {

            const { data } = await apiConfig.post<tripsAcceptedResponse>(`/trip/driverAccepted/${id}`);
            if (!data.success) {
                return;
            }

            set({
                tripCurrentClient: data.user,
                tripCurrent: data.trip
            })

            showToast({
                type: "success",
                title: "Viaje aceptado",
                message: "Ya avisamos al cliente",
                visibilityTime: 6000
            });

        } catch (error) {
            set({ errorMessage: (error as ErrorAPI).response?.data?.msg || "Error al comentar" });
        }
    },

    postDriverArrived: async (id: string) => {

        try {

            const { data } = await apiConfig.post<tripsAcceptedResponse>(`/trip/driverArrived/${id}`);
            if (!data.success) {
                return;
            }

            set({
                tripCurrent: data.trip
            })

            showToast({
                type: "success",
                title: "Ya llegaste",
                message: "El cliente te espera.",
                visibilityTime: 6000
            });

        } catch (error) {
            set({ errorMessage: (error as ErrorAPI).response?.data?.msg || "Error al comentar" });
        }
    },

    postTripStarted: async (id: string) => {

        try {

            interface TripStartedResponse {
                polyline: { latitude: number; longitude: number }[];
                polylineType: string;
                trip: trip;
            }
            const { data } = await apiConfig.post<TripStartedResponse>(`/trip/tripStarted/${id}`);

            set({ polyline: data.polyline, polylineType: data.polylineType, tripCurrent: data.trip, tripStarted: true, travelState: "in_progress" });

        } catch (error) {
            set({ errorMessage: (error as ErrorAPI).response?.data?.msg || "Error al comentar" });
        }
    },

    postTripEnd: async (id: string) => {

        try {

            await apiConfig.post<tripsAcceptedResponse>(`/trip/tripEnd/${id}`);

            set({
                tripCurrentVehicle: null,
                tripCurrentClient: null,
                polyline: null,
                tripCurrent: null,
                polylineType: "",
                positionDriverEvent: null,
                tripStarted: false,
                endTrip: true,
                travelState: "idle"
            });

            showToast({
                type: "success",
                title: "Viaje Finalizado",
                message: "Gracias por usar nuestro servicio.",
                visibilityTime: 5000
            });

        } catch (error) {
            set({ errorMessage: (error as ErrorAPI).response?.data?.msg || "Error al comentar" });
        }
    },


    getVehicle: async () => {

        try {

            const { data } = await apiConfig.get<vehicle>(`/vehicles/`);

            set({
                tripCurrentVehicle: data
            })

        } catch (error) {
            set({ errorMessage: (error as ErrorAPI).response?.data?.msg || "Error al comentar" });
        }
    },

    postSendLocation: async (latitude: number, longitude: number) => {

        try {

            await apiConfig.post(`/driver/location/`, {
                latitude,
                longitude
            });

        } catch (error) {
            set({ errorMessage: (error as ErrorAPI).response?.data?.msg || "Error al comentar" });
        }
    }

}));