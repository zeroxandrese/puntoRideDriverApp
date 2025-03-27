import axios from "axios";
import {API_URL} from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = API_URL;

const apiConfig = axios.create({ baseURL });

apiConfig.interceptors.request.use(
    async (config: any) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers['z-token'] = token;
        }
        return config;
    }
)


export default apiConfig;