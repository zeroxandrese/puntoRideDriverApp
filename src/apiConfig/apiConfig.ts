import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_URL } from "@env";
import almacenamientoSeguro from '../utils/almacenamientoSeguro';
import servicioLogger from '../utils/servicioLogger';

const baseURL = API_URL;

const apiConfig = axios.create({ baseURL });

// Interceptor de solicitud
apiConfig.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await almacenamientoSeguro.obtenerToken();
        if (token) {
            config.headers['z-token'] = token;
        }

        if (__DEV__) {
            servicioLogger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
                headers: config.headers,
                data: config.data
            });
        }

        return config;
    },
    (error: AxiosError) => {
        servicioLogger.error('Error en solicitud API', error);
        return Promise.reject(error);
    }
);

// Interceptor de respuesta
apiConfig.interceptors.response.use(
    (response) => {
        if (__DEV__) {
            servicioLogger.debug(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        }
        return response;
    },
    (error: AxiosError) => {
        servicioLogger.logApiError(
            error.config?.url || 'Unknown',
            error,
            {
                method: error.config?.method,
                data: error.config?.data,
                status: error.response?.status
            }
        );

        if (error.response?.status === 401) {
            almacenamientoSeguro.eliminarCredenciales();
            // TODO: Redirigir a login
        }

        return Promise.reject(error);
    }
);

export default apiConfig;