import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

import { trip } from '../interface/interface';
import { ActivityIndicator } from 'react-native-paper';

const { height } = Dimensions.get('window');

interface TripDetailProps {
    trip: trip;
    onConfirm: () => void;
    setTripDetail: (trip: trip | null) => void;
    btnDisable: boolean;
}

export const ServiceDetailScreen = ({ trip, onConfirm, setTripDetail, btnDisable }: TripDetailProps) => {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🚗 Detalle del Viaje</Text>

            <View style={styles.infoContainer}>
                <View style={styles.row}>
                    <FontAwesome6 name="location-dot" size={20} color="#333" iconStyle="solid" />
                    <Text style={styles.label}>Origen:</Text>
                    <Text style={styles.value}>{trip.addressStart}</Text>
                </View>

                <View style={styles.row}>
                    <FontAwesome6 name="flag-checkered" size={20} color="#333" iconStyle="solid" />
                    <Text style={styles.label}>Destino:</Text>
                    <Text style={styles.value}>{trip.addressEnd}</Text>
                </View>

                <View style={styles.row}>
                    <FontAwesome6 name="map-location-dot" size={20} color="#333" iconStyle="solid" />
                    <Text style={styles.label}>Distancia:</Text>
                    <Text style={styles.value}>{trip.kilometers} km</Text>
                </View>

                <View style={styles.row}>
                    <FontAwesome6 name="dollar-sign" size={20} color="#333" iconStyle="solid" />
                    <Text style={styles.label}>Precio:</Text>
                    <Text style={styles.value}>${trip.offeredPrice ?? trip.price}</Text>
                </View>

                <View style={styles.row}>
                    <FontAwesome6 name="clock" size={20} color="#333" />
                    <Text style={styles.label}>Tiempo estimado:</Text>
                    <Text style={styles.value}>{trip.estimatedArrival}</Text>
                </View>

            </View>

            {btnDisable ? (
                <ActivityIndicator animating={true} color="#D99A06" size="large" style={{ marginTop: 6 }} />
            ) : (
                <>
                    <TouchableOpacity disabled={btnDisable} style={styles.button} onPress={onConfirm}>
                        <Text style={styles.buttonText}>✅ Confirmar Viaje</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={btnDisable} style={styles.buttonCancel} onPress={() => setTripDetail(null)}>
                        <Text style={styles.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </>
            )
            }

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 20,
        color: '#2C3E50',
        textAlign: 'center',
    },
    infoContainer: {
        marginBottom: 20,
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    label: {
        fontWeight: '600',
        color: '#555',
        marginLeft: 4,
    },
    value: {
        color: '#333',
        marginLeft: 4,
        flexShrink: 1,
        fontWeight: '500',
    },
    button: {
        backgroundColor: '#27AE60',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
    },
    buttonCancel: {
        backgroundColor: '#666666',
        marginVertical: 30,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});