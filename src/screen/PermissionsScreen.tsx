import React, { useEffect, useState } from "react";
import { View, Text, StatusBar, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { FAB } from 'react-native-paper';

import { RootStackParamList } from '../interface/interface';
import { userPermissionStore } from "../store/permissions/userPermissionStore";
import { globalStyle } from "../theme/global.style";
import CarBack from '../assets/backCarg.svg';

type NavigationProps = StackNavigationProp<RootStackParamList, "HomeScreen">;

export const PermissionsScreen = () => {
  const { requestLocationPermissions, locationStatus } = userPermissionStore();
  const navigation = useNavigation<NavigationProps>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (locationStatus === "granted") {
      navigation.navigate("HomeScreen");
    }
  }, [locationStatus]);

  const handleRequestPermission = async () => {
    setLoading(true);
    const status = await requestLocationPermissions();
    setLoading(false);

    if (status === "granted") {
      navigation.navigate("HomeScreen");
    } else {
      Alert.alert("Permiso requerido", "Necesitas otorgar permisos de ubicación para continuar.");
    }
  };

  return (
    <View style={globalStyle.ContainarCenterWithBackgroundGenral}>
      <StatusBar backgroundColor="#FFBC07" barStyle="dark-content" />
      <CarBack />
      <View style={{ margin: 16 }}>
        <Text style={globalStyle.textTitlePermissionScreen}>
          PuntoRide App necesita acceso a tu ubicación
        </Text>

        <Text style={globalStyle.textDescriptionPermissionScreen}>
          Para brindarte una mejor experiencia y mostrarte información relevante, necesitamos acceder a tu ubicación.
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FAB
          onPress={() => handleRequestPermission()}
          label={"Conceder permisos"}
          accessibilityLabel="Otorgar permisos"
          style={{ backgroundColor: "#4A4A4A" }}
          color='#FFFFFF'
        />
      )}

      {locationStatus === "denied" && (
        <Text style={{ marginTop: 20, color: "red", textAlign: "center" }}>
          No concediste permisos. Puedes activarlos desde la configuración del dispositivo.
        </Text>
      )}
    </View>
  );
};