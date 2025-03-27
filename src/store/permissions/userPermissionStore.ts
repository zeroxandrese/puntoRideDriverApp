import { create } from "zustand";
import type { PermissionStatus } from "../../interface/permissions";
import { requestLocationPermissions, checkLocationPermissions } from '../../actions/permissions/location';

interface PermissionState {
    locationStatus: PermissionStatus;

    requestLocationPermissions: () =>Promise<PermissionStatus>;
    checkLocationPermissions: () =>Promise<PermissionStatus>;
}

export const userPermissionStore = create<PermissionState>()( set =>({
    locationStatus: 'undetermined',

    requestLocationPermissions: async () =>{
       const status = await requestLocationPermissions();
       set({ locationStatus: status });

       return status
    },

    checkLocationPermissions: async () =>{
        const status = await checkLocationPermissions();
        set({ locationStatus: status });
 
        return status
     }
}))