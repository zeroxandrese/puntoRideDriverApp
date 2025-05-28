import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';

import { Location, LatLng, vehicle, trip } from '../interface/interface';
import { useServiceBusinessStore } from "../store/business/useServiceBusiness";
import { moveCameraStore } from '../store/Actions/moveCameraStore';

interface LocationObject {
    formatted_address: string;
    location: {
        lat: number;
        lng: number;
    };
}

interface Props {
    setServiceMarkers: (markers: { origin: LatLng; destination: LatLng }) => void;
    setTripDetail: (trip: trip) => void;

};

export const ServiceScreen = ({
    setServiceMarkers,
    setTripDetail
}: Props) => {

    const { setLocationMoveCamera } = moveCameraStore();
    const { getTripAvailable, tripsAvailable } = useServiceBusinessStore();
    const [refreshing, setRefreshing] = useState(false);

    const fetchTrips = useCallback(async () => {
        setRefreshing(true);
        await getTripAvailable();
        setRefreshing(false);
    }, []);

    useEffect(() => {
        fetchTrips();
    }, []);

    const moveCameraOnPress = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
        if (latitude && longitude) {
            setLocationMoveCamera({ latitude, longitude });
        }
    };

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={fetchTrips} />
            }
            contentContainerStyle={{ padding: 16, paddingBottom: 32, marginTop: 20 }}
        >
            {/* Título principal */}
            <Text
                style={{
                    fontSize: 22,
                    fontWeight: '700',
                    color: '#333',
                    marginBottom: 20,
                    textAlign: 'center',
                }}
            >
                Viajes disponibles para ti
            </Text>

            {/* Lista de viajes */}
            {Array.isArray(tripsAvailable) && tripsAvailable.length > 0 ? (
                tripsAvailable.map((trip) => (
                    <TouchableOpacity
                        key={trip.uid}
                        onPress={() => {
                            setTripDetail(trip)
                            moveCameraOnPress({
                                latitude: trip.latitudeStart,
                                longitude: trip.longitudeStart
                            })
                            setServiceMarkers({
                                origin: {
                                    latitude: trip.latitudeStart,
                                    longitude: trip.longitudeStart,
                                },
                                destination: {
                                    latitude: trip.latitudeEnd,
                                    longitude: trip.longitudeEnd,
                                },
                            })
                        }
                        }
                        style={{
                            backgroundColor: '#f9f9f9',
                            borderRadius: 16,
                            padding: 20,
                            marginBottom: 16,
                            shadowColor: '#000',
                            shadowOpacity: 0.08,
                            shadowOffset: { width: 0, height: 4 },
                            shadowRadius: 8,
                            elevation: 4,
                            borderWidth: 1,
                            borderColor: '#e0e0e0',
                        }}
                    >
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 }}>
                            📍 Salida: {trip.addressStart}
                        </Text>
                        <Text style={{ fontSize: 15, color: '#555', marginBottom: 4 }}>
                            🛬 Destino: {trip.addressEnd}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: '#2196F3' }}>
                                💰 ${trip.offeredPrice ?? trip.price}
                            </Text>
                            <Text style={{ fontSize: 15, fontWeight: '500', color: '#4CAF50' }}>
                                ⏱️ {trip.estimatedArrival} min
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={{ textAlign: 'center', color: '#777', marginTop: 20 }}>
                    No hay viajes disponibles por el momento 🚫
                </Text>
            )}
        </ScrollView >
    );
};