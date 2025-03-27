import React, { useState, useEffect } from 'react';
import {
    View, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback,
    TouchableOpacity, Text,
    SafeAreaView,
} from 'react-native';
import Geocoder from 'react-native-geocoding';

import { key } from "@env";
import { FAB, TextInput } from 'react-native-paper';

import { useForm } from '../components/useForm';
import Lorry from '../assets/lorry.svg';
import Sedan from '../assets/sedan.svg';
import Motorcycle from '../assets/motorcycle.svg';
import IconStartLocation from '../assets/iconStartLocation.svg';
import LocationSolid from '../assets/location-dot-solid.svg';
import { Location, postTripCalculateData } from "../interface/interface";
import { globalStyle } from '../theme/global.style';
import { moveCameraStore } from '../store/Actions/moveCameraStore';
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useServiceBusinessStore } from '../store/business/useServiceBusiness';

interface LocationObject {
    formatted_address: string;
    location: {
        lat: number;
        lng: number;
    };
}

interface Props {
    initialLocation: Location
}

export const RequestServiceScreen = ({ initialLocation }: Props) => {

    const { setLocationMoveCamera } = moveCameraStore();
    const { postTripCalculate } = useServiceBusinessStore();
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | undefined>();
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [currentLocationText, setCurrentLocationText] = useState("");
    const [selectedService, setSelectedService] = useState<'taxi' | 'envio'>('taxi');

    Geocoder.init(key, { language: "es" });

    const [locationData, setLocationData] = useState<{
        latitude: number;
        longitude: number;
        predictions: LocationObject[];
    }>({
        latitude: 0,
        longitude: 0,
        predictions: [],
    });

    const [locationDataInitial, setLocationDataInitial] = useState<{
        latitude: number;
        longitude: number;
        predictions: LocationObject[];
    }>({
        latitude: 0,
        longitude: 0,
        predictions: [],
    });


    const { destinationAdress, originAdress, cambioFormulario } = useForm({
        destinationAdress: "",
        originAdress: ""
    });

    useEffect(() => {
        reverseGeocodeLocation(initialLocation);

        setLocationDataInitial(prev => ({
            ...prev,
            latitude: initialLocation.latitude,
            longitude: initialLocation.longitude
        }));

        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(() => {
        if (!isKeyboardVisible) {
            Keyboard.dismiss();
        }
    }, [isKeyboardVisible]);

    useEffect(() => {
        console.log('Location Data:', locationData);
        console.log('Location Data Initial:', locationDataInitial);
    }, [locationData, locationDataInitial]);

    const reverseGeocodeLocation = async (location: Location) => {
        try {
            if (!location) return;
            const response = await Geocoder.from(location.latitude, location.longitude);
            const address = response.results[0]?.formatted_address;
            setCurrentLocationText(address && address.length > 40 ? address.slice(0, 40) + "..." : address || "Sin resultados");
        } catch {
            setCurrentLocationText("Error al obtener dirección");
        }
    };

    const moveCameraOnPress = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
        if (latitude && longitude) {
            setLocationMoveCamera({ latitude, longitude });
        }
    };

    const postDataCalculateTrip = ({ latitudeStart, longitudeStart,
        latitudeEnd, longitudeEnd, paymentMethod, discountCode
    }: postTripCalculateData) => {
        console.log('fuera del onpress')
        console.log(latitudeStart, longitudeStart, latitudeEnd, longitudeEnd, paymentMethod)
        if (latitudeStart && longitudeStart && latitudeEnd && longitudeEnd && paymentMethod) {
            console.log('dentro del onpress')
            postTripCalculate({ latitudeStart, longitudeStart, latitudeEnd, longitudeEnd, paymentMethod });
        }
    };

    //Función de busqueda 
    const handleSearchInput = (text: string, field: 'destinationAdress' | 'originAdress') => {
        // Cancelar el timeout si existe
        if (searchTimeout) clearTimeout(searchTimeout);

        // Actualización del formulario
        cambioFormulario(text, field);

        const newSearchTimeout = setTimeout(() => {
            if (text.trim() === '') {
                if (field === 'destinationAdress') {
                    setLocationData(prev => ({ ...prev, predictions: [], latitude: 0, longitude: 0 }));
                } else {
                    setLocationDataInitial(prev => ({ ...prev, predictions: [], latitude: 0, longitude: 0 }));
                }
                return;
            }

            Geocoder.from(text)
                .then(json => {
                    const firstFiveResults = json.results.slice(0, 5).map(obj => ({
                        formatted_address: obj.formatted_address.length > 40
                            ? obj.formatted_address.substring(0, 40) + "..."
                            : obj.formatted_address,
                        location: obj.geometry.location,
                    }));

                    const { lat, lng } = firstFiveResults[0]?.location || { lat: 0, lng: 0 };

                    if (field === 'destinationAdress') {
                        setLocationData(prev => ({
                            ...prev,
                            predictions: firstFiveResults,
                            latitude: lat,
                            longitude: lng
                        }));
                    } else {
                        setLocationDataInitial(prev => ({
                            ...prev,
                            predictions: firstFiveResults,
                            latitude: lat,
                            longitude: lng
                        }));
                    }
                })
                .catch(() => {
                    if (field === 'destinationAdress') {
                        setLocationData(prev => ({
                            ...prev,
                            predictions: [{ formatted_address: "Sin resultados", location: { lat: 0, lng: 0 } }],
                            latitude: 0,
                            longitude: 0
                        }));
                    } else {
                        setLocationDataInitial(prev => ({
                            ...prev,
                            predictions: [{ formatted_address: "Sin resultados", location: { lat: 0, lng: 0 } }],
                            latitude: 0,
                            longitude: 0
                        }));
                    }
                });
        }, 500);

        setSearchTimeout(newSearchTimeout);
    };

    const handleSelect = (service: 'taxi' | 'envio') => {
        setSelectedService(service);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: 'transparent' }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 80}
        >
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <BottomSheetScrollView
                    contentContainerStyle={globalStyle.BottomSheetScrollView}
                    keyboardShouldPersistTaps="handled">
                    <View style={{ marginVertical: 16, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>
                            ¿A dónde irás hoy?
                        </Text>
                        <Text style={{ fontSize: 14, color: '#666' }}>
                            Elige tu destino y comenzamos el viaje
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <View style={globalStyle.containerStyleRowBottomInput}>
                            <View style={{ alignItems: 'center' }}>
                                <LocationSolid width={25} height={25} />
                                <View style={{
                                    backgroundColor: '#000000', height: 13, width: 1, marginTop: 2
                                }} />
                            </View>
                            <TextInput
                                mode="flat"
                                placeholder="Ingresa tu destino"
                                style={globalStyle.StyleTextDirectionInput}
                                keyboardType="default"
                                maxLength={160}
                                onChangeText={(text) => handleSearchInput(text, 'destinationAdress')}
                                value={destinationAdress}
                            />
                        </View>
                    </View>
                    {locationData.predictions.length > 0 && destinationAdress.trim() !== '' && (
                        <View style={{ alignItems: 'center', marginVertical: 5 }}>
                            {locationData.predictions.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={globalStyle.touchablePredictions}
                                    onPress={() => {
                                        cambioFormulario(item.formatted_address, "destinationAdress");
                                        moveCameraOnPress({ latitude: item.location.lat, longitude: item.location.lng });
                                        setLocationData((prev) => ({ ...prev, predictions: [] }));
                                    }}
                                >
                                    <Text style={globalStyle.textPredictions}>{item.formatted_address}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <View style={globalStyle.viewLineRequestServiceScreen} />
                    <View style={{ alignItems: 'center' }}>
                        <View style={globalStyle.containerStyleRowBottomInput}>
                            <View style={{ alignItems: 'center' }}>
                                <View style={{
                                    backgroundColor: '#000000', height: 20, width: 1, marginTop: 2
                                }} />
                                <IconStartLocation width={25} height={25} />
                            </View>
                            <TextInput
                                mode="flat"
                                placeholder={currentLocationText ?? "Ingresa tu origen"}
                                textColor=''
                                style={globalStyle.StyleTextDirectionInput}
                                keyboardType="default"
                                maxLength={160}
                                onChangeText={(text) => handleSearchInput(text, 'originAdress')}
                                value={originAdress}
                            />
                        </View>
                    </View>
                    {locationDataInitial.predictions.length > 0 && originAdress.trim() !== '' && (
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            {locationDataInitial.predictions.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={globalStyle.touchablePredictions}
                                    onPress={() => {
                                        cambioFormulario(item.formatted_address, "originAdress");
                                        setLocationDataInitial((prev) => ({ ...prev, predictions: [] }));
                                    }}
                                >
                                    <Text style={globalStyle.textPredictions}>{item.formatted_address}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <View style={globalStyle.ContainarCenter}>
                        <View style={globalStyle.ContainerFabRequestServiceScreen}>
                            <Text style={globalStyle.TextStyleContainerFabRequestServiceScreen}>¿Que servicio necesitas?</Text>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <FAB
                                    icon={() => <Sedan width={30} height={30} />}
                                    label="Taxi"
                                    style={[
                                        globalStyle.StyleFABRequestScreenTypes,
                                        selectedService === 'taxi' ? { backgroundColor: '#D99A06' } : {}
                                    ]}
                                    onPress={() => handleSelect('taxi')}
                                    color={"#FFFFFF"}
                                    mode="flat"
                                />
                                <FAB
                                    icon={() => <Lorry width={25} height={25} />}
                                    label="Envio"
                                    style={[
                                        globalStyle.StyleFABRequestScreenTypes,
                                        selectedService === 'envio' ? { backgroundColor: '#D99A06' } : {}
                                    ]}
                                    onPress={() => handleSelect('envio')}
                                    color={"#FFFFFF"}
                                    mode="flat"
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ elevation: 8, flex: 1, shadowOpacity: 0.3, alignItems: 'center' }}>
                        <FAB
                            label='Confirmar'
                            style={globalStyle.styleFABConfirmRequestServiceScreen}
                            color={"#000000"}
                            mode="flat"
                            onPress={() => postDataCalculateTrip({
                                latitudeStart: locationDataInitial.latitude,
                                longitudeStart: locationDataInitial.longitude,
                                latitudeEnd: locationData.latitude,
                                longitudeEnd: locationData.longitude,
                                paymentMethod: 'cash'
                            })}
                        />
                    </View>
                </BottomSheetScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}
