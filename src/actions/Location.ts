import Geolocation from '@react-native-community/geolocation';
import { Location }  from '../interface/interface';

export const getCurrentLocation = async (): Promise<Location>=> {

 return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition( (info) =>{

        resolve({
            latitude: info.coords.latitude,
            longitude: info.coords.longitude
        })
    }, (error) =>{
        console.log("Can't get location")
        reject(error)
    },{
        enableHighAccuracy: true,
        timeout: 5000,  // Tiempo máximo de espera: 5 segundos
        maximumAge: 2000  // Usar caché de ubicación de máximo 2 segundos
    })
 })
}