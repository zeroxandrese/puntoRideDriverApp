import { Platform } from "react-native";
import { PERMISSIONS, PermissionStatus as RNPermissionsStatus, request, openSettings, check } from 'react-native-permissions'
import { PermissionStatus } from '../../interface/permissions';


export const requestLocationPermissions = async (): Promise<PermissionStatus> => {

    let status: RNPermissionsStatus = 'unavailable';

    if (Platform.OS === 'ios') {
        status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
    } else if (Platform.OS === 'android') {
        status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    } else {
        throw new Error("Unsupported platform");
    }

    if (status === 'blocked') {
        await openSettings();
        return await checkLocationPermissions();
    }

    const permissionMapper : Record<RNPermissionsStatus, PermissionStatus> ={
        granted: 'granted',
        denied: 'denied',
        blocked: 'blocked',
        unavailable: 'unavailable',
        limited: 'limited'
    }

    return permissionMapper[status] ?? 'unavailable';
}

export const checkLocationPermissions = async (): Promise<PermissionStatus> => {

    let status: RNPermissionsStatus = 'unavailable';

    if (Platform.OS === 'ios') {
        status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
    } else if (Platform.OS === 'android') {
        status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    } else {
        throw new Error("Unsupported platform");
    }

    const permissionMapper : Record<RNPermissionsStatus, PermissionStatus> ={
        granted: 'granted',
        denied: 'denied',
        blocked: 'blocked',
        unavailable: 'unavailable',
        limited: 'limited'
    }

    return permissionMapper[status] ?? 'unavailable';
}