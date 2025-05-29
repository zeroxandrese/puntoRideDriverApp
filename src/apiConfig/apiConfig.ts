import axios, { AxiosRequestConfig, AxiosError } from "axios";
import {API_URL} from "@env";
import almacenamientoSeguro from '../utils/almacenamientoSeguro';
import servicioLogger from '../utils/servicioLogger';

const baseURL = API_URL;

const apiConfig = axios.create({ baseURL });

// Interceptor de solicitud
apiConfig.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
        const token = await almacenamientoSeguro.obtenerToken();
        if (token && config.headers) {
            config.headers['z-token'] = token;
        }
        
        // Log de solicitud en desarrollo
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
)

// Interceptor de respuesta
apiConfig.interceptors.response.use(
    (response) => {
        // Log de respuesta exitosa en desarrollo
        if (__DEV__) {
            servicioLogger.debug(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        }
        return response;
    },
    (error: AxiosError) => {
        // Log detallado del error
        servicioLogger.logApiError(
            error.config?.url || 'Unknown',
            error,
            {
                method: error.config?.method,
                data: error.config?.data,
                status: error.response?.status
            }
        );
        
        // Manejo específico de errores comunes
        if (error.response?.status === 401) {
            // Token expirado o inválido
            almacenamientoSeguro.eliminarCredenciales();
            // TODO: Redirigir a login
        }
        
        return Promise.reject(error);
    }
)


export default apiConfig;