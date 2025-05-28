import React, { useEffect } from 'react';
import {
    View,
    Platform,
    TouchableOpacity,
    KeyboardAvoidingView,
    FlatList,
    StyleSheet
} from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../interface/interface';
import { globalStyle } from '../theme/global.style';
import ArrowBack from '../assets/arrowBack.svg';
import { useServiceBusinessStore } from '../store/business/useServiceBusiness';

type NavigationProps = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

export const HistoryTripScreen = () => {
    const { getHistoryTrip, tripsHistory } = useServiceBusinessStore();
    const navigation = useNavigation<NavigationProps>();

    useEffect(() => {
        getHistoryTrip();
    }, []);

    const weeklyTrips = tripsHistory?.filter((trip) => {
        const tripDate = new Date(trip.created);
        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        return tripDate >= oneWeekAgo && trip.complete;
    });

    const totalTrips = weeklyTrips?.length || 0;
    const totalEarnings = weeklyTrips?.reduce((sum, trip) => sum + trip.price, 0).toFixed(2) || "0.00";

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: '#EDF9FD' }}
        >
            <View style={globalStyle.containerHistory}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 60 }}>
                    <ArrowBack width={60} height={60} />
                </TouchableOpacity>

                <View style={globalStyle.containerHistoryChildren}>
                    <Text style={globalStyle.titleContactUs}>Resumen de conductor</Text>
                    <Text style={{ color: '#7F8C8D', fontSize: 14, marginBottom: 10 }}>
                        Revisa tus viajes más recientes y tus métricas de desempeño.
                    </Text>

                    {/* KPIs */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 20 }}>
                        <View style={styles.kpiCard}>
                            <Text style={styles.kpiValue}>{totalTrips}</Text>
                            <Text style={styles.kpiLabel}>Viajes esta semana</Text>
                        </View>
                        <View style={styles.kpiCard}>
                            <Text style={styles.kpiValue}>${totalEarnings}</Text>
                            <Text style={styles.kpiLabel}>Ganancias semanales estimadas</Text>
                        </View>
                    </View>

                    <View style={globalStyle.headerLine} />

                    {Array.isArray(tripsHistory) && tripsHistory.length > 0 ? (
                        <FlatList
                            data={tripsHistory.slice(0, 10)}
                            keyExtractor={(item) => item.uid}
                            style={{ marginBottom: 50 }}
                            contentContainerStyle={{ paddingBottom: 200 }}
                            renderItem={({ item }) => {
                                const statusText = item.complete
                                    ? '✅ Completado con éxito'
                                    : '🕓 En curso';

                                const statusColor = item.complete
                                    ? '#27AE60'
                                    : '#7F8C8D';

                                return (
                                    <View style={[globalStyle.cardHistoryTrip, styles.tripCard]}>
                                        <Text style={[globalStyle.date, { fontWeight: '600', fontSize: 14 }]}>
                                            📅 {item.created.split('T')[0]}
                                        </Text>
                                        <Text style={globalStyle.route}>
                                            📍 De: <Text style={globalStyle.bold}>{item.addressStart}</Text>
                                        </Text>
                                        <Text style={globalStyle.route}>
                                            📍 A: <Text style={globalStyle.bold}>{item.addressEnd}</Text>
                                        </Text>
                                        <Text style={globalStyle.route}>
                                            💵 Precio: <Text style={globalStyle.boldPrice}>{item.price} $</Text>
                                        </Text>
                                        <Text style={[globalStyle.statusCardHistoryTrip, { color: statusColor, fontWeight: '600', marginTop: 5 }]}>
                                            {statusText}
                                        </Text>
                                    </View>
                                );
                            }}
                        />
                    ) : (
                        <View style={globalStyle.containerNoHistory}>
                            <Text style={globalStyle.subtitleHistory}>
                                🕓 Aún no has realizado ningún viaje.
                            </Text>
                            <Text style={{ marginTop: 5, fontSize: 14, color: '#7F8C8D', textAlign: 'center', paddingHorizontal: 20 }}>
                                Una vez que hagas tu primer viaje, lo verás aquí con todos los detalles.
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    kpiCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        width: '48%',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        alignItems: 'center',
    },
    kpiValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#34495E',
    },
    kpiLabel: {
        fontSize: 13,
        color: '#7F8C8D',
        marginTop: 4,
        textAlign: 'center',
    },
    tripCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
});