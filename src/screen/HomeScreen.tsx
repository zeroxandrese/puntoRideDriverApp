import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Keyboard } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSocket, useSocketTrip } from '../context/SocketContext';
import { useSocketEvents } from '../hooks/useSocketEvents';
import Modal from 'react-native-modal';

import { RootStackParamList, LatLng, trip } from '../interface/interface';
import { ModalVisibilidad } from '../interface/errores';
import CarLoading from '../components/cardLoading';
import { Maps } from "../components/Maps";
import { useLocationStore } from '../store/location/locationStore';
import { globalStyle } from '../theme/global.style';
import { useServiceBusinessStore } from "../store/business/useServiceBusiness";
import IconMenu from "../assets/iconMenu.svg";
import { CurrentTripScreen } from './CurrentTripScreen';
import useAuthStore from '../globalState/globalState';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { ServiceScreen } from '../screen/ServiceScreen';
import { ServiceDetailScreen } from './ServiceDetailScreen';
import useSendLocation from '../components/useSendLocation';

type NavigationProps = StackNavigationProp<RootStackParamList, "HomeScreen">;

export const HomeScreen = () => {
  useSendLocation();
  const navigation = useNavigation<NavigationProps>();
  const { user, logOut } = useAuthStore();
  const { lastKnowLocation, getLocation } = useLocationStore();
  const snapPoints = useMemo(() => ["55%", "100%"], []);
  const [tripDetail, setTripDetail] = useState<trip | null>(null);
  const [statusPanDown, setStatusPanDown] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false)
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { tripCurrent, tripCurrentVehicle,
    tripCurrentClient, initSocketListeners, comments,
    polyline, tripStarted, travelState, set, postCancelTrip,
    removeSocketListeners, getActiveTrip, postAcceptedTrip, getVehicle, endTrip } = useServiceBusinessStore();
  const { conectado, estadoConexion, emitir } = useSocket();
  const { confirmarViaje } = useSocketTrip();
  
  // Inicializar listeners de eventos socket
  useSocketEvents();

  const [serviceMarkers, setServiceMarkers] = useState<{ origin: LatLng; destination: LatLng }>({
    origin: { latitude: 0, longitude: 0 },
    destination: { latitude: 0, longitude: 0 }
  });

  const [modalVisible, setModalVisible] = useState({
    modal1: false,
    modal2: false
  });

  const toggleModal = (modalName: string) => {
    setModalVisible((prev) => ({
      ...prev,
      [modalName]: !prev[modalName],
    }));
  };

  useEffect(() => {
    getVehicle();
  }, []);

  useEffect(() => {
    // Emitir confirmación cuando haya un viaje activo y esté conectado
    if (conectado && tripCurrent?.uid) {
      setStatusPanDown(true);
      confirmarViaje(tripCurrent.uid);
    }
  }, [tripCurrent?.uid, conectado, confirmarViaje]);

  useEffect(() => {
    // Socket connection is now managed by SocketProvider
    const initializeData = async () => {
      // Conectar socket con autenticación
      const connected = await conectarSocketConAuth();
      
      if (!connected) {
        console.log("❌ No se pudo conectar el socket (sin autenticación)");
        return;
      }
    };

    const handleConnect = () => {
      console.log("✅ Socket conectado (handleConnect)");

      if (user?.uid) {
        console.log("📨 Registrando usuario:", user.uid);
        socket.emit("register-user", user.uid);
        socket.emit("join", user.uid);
      }

      // Socket listeners now managed by useSocketEvents hook // si tienes listeners personalizados
    };

    const handleDisconnect = () => {
      console.log("🔌 Socket desconectado");
    };

    const handleError = (err: Error) => {
      console.log("❌ Error en socket:", err.message);
    };

    // Inicializar conexión autenticada
    if (user?.uid) {
      initializeSocket();
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      // Cleanup now handled by useSocketEvents hook
      desconectarSocket();
    };
  }, [user?.uid]);

  useEffect(() => {
    if (tripDetail) {
      bottomSheetRef.current?.snapToIndex(0)
    } else {
      bottomSheetRef.current?.snapToIndex(1)
    }
  }, [tripDetail]);

  useEffect(() => {
    if (endTrip === true) {
      setServiceMarkers({
        origin: { latitude: 0, longitude: 0 },
        destination: { latitude: 0, longitude: 0 }
      });

      useServiceBusinessStore.setState({ endTrip: null });
      bottomSheetRef.current?.snapToIndex(1)
      setStatusPanDown(false);
    }
  }, [endTrip]);

  useEffect(() => {
    if (!lastKnowLocation) {
      getLocation();
    }
  }, [lastKnowLocation]);

  if (lastKnowLocation === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CarLoading />
      </View>
    );
  };

  return (
    <>
      <GestureHandlerRootView style={globalStyle.GlobalContainerCustom}>
        <View style={StyleSheet.absoluteFillObject}>
          <StatusBar backgroundColor="#FFBC07" barStyle="dark-content" />
          <Maps initialLocation={lastKnowLocation}
            polyline={polyline} markers={serviceMarkers} tripCurrent={tripCurrent}
            vehicle={user?.vehicleType}
            onDestinationChange={(coords) => {
              setServiceMarkers(prev => ({
                ...prev,
                destination: coords
              }));
            }}
          />
          <View style={{
            position: 'absolute',
            top: 50,
            left: 20,
            zIndex: 10,
            elevation: 10,
            shadowColor: "#000"
          }}>
            <TouchableOpacity
              onPress={() => {
                toggleModal('modal2');
              }}
            >
              <IconMenu />
            </TouchableOpacity>
          </View>
          <BottomSheet
            ref={bottomSheetRef}
            backgroundStyle={{ backgroundColor: '#EDF9FD' }}
            index={1}
            enablePanDownToClose={statusPanDown}
            enableContentPanningGesture={statusPanDown}
            enableHandlePanningGesture={statusPanDown}
            keyboardBehavior="interactive"
            snapPoints={snapPoints}
            onChange={(index) => {
              if (index === 0) {
                Keyboard.dismiss();
              }
            }}
            handleIndicatorStyle={globalStyle.handleIndicatorStyleCustom}
            handleStyle={globalStyle.handleStyleCustom}
          >
            <BottomSheetScrollView
              contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'flex-start',
                flex: 1,
                paddingBottom: 24,
                backgroundColor: '#EDF9FD',
              }}
              style={{ flex: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              {
                tripCurrent ? (
                  <CurrentTripScreen trip={tripCurrent}
                    tripCurrentVehicle={tripCurrentVehicle}
                    tripCurrentClient={tripCurrentClient}
                    user={user}
                    comments={comments}
                    tripStarted={tripStarted}
                  />
                ) : tripDetail ? (
                  <ServiceDetailScreen
                    btnDisable={btnDisable}
                    trip={tripDetail}
                    setTripDetail={setTripDetail}
                    onConfirm={async () => {
                      setBtnDisable(true);
                      await postAcceptedTrip(tripDetail.uid);
                      setBtnDisable(false);
                      setTripDetail(null);
                    }}
                  />
                ) : (
                  <ServiceScreen
                    setServiceMarkers={setServiceMarkers}
                    setTripDetail={setTripDetail}
                  />
                )
              }
            </BottomSheetScrollView>
          </BottomSheet>
        </View>
      </GestureHandlerRootView>
      {travelState === "sending" ? (
        <View style={globalStyle.cancelModalView}>
          <Text style={globalStyle.titleCancelView}>¿Quieres cancelar el viaje?</Text>
          <TouchableOpacity style={{ marginHorizontal: 40 }}
            onPress={async () => {
              if (tripCurrent?.uid) {
                await postCancelTrip(tripCurrent?.uid);
                bottomSheetRef.current?.snapToIndex(1);
                setServiceMarkers({
                  origin: { latitude: 0, longitude: 0 },
                  destination: { latitude: 0, longitude: 0 }
                });
              } else {
                console.warn("No se encontró un tripId válido para cancelar");
              }
            }}
          >
            <Text style={{ color: 'red', fontSize: 16 }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : null
      }
      <Modal
        isVisible={modalVisible.modal2}
        onBackdropPress={() => toggleModal('modal2')}
        backdropOpacity={0.5}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        style={{ margin: 0, justifyContent: 'flex-start' }}
      >
        <View style={globalStyle.modalContainerMenuChildren}>
          <Text style={globalStyle.headerMenu}>Menú</Text>
          <Text style={globalStyle.headerNameMenu}>Hola {user?.name ?? "Usuario"} 👋</Text>
          <View style={globalStyle.headerLine} />
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
            <TouchableOpacity style={globalStyle.menuItem}
              onPress={() => {
                bottomSheetRef.current?.snapToIndex(1);
                toggleModal('modal2');
              }}>
              <FontAwesome6 name="car" size={20} color="#333" style={globalStyle.icon} iconStyle="solid" />
              <Text style={globalStyle.menuText}>Viajemos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={globalStyle.menuItem}
              onPress={() => {
                navigation.navigate('HistoryTripScreen');
                toggleModal('modal2');
              }}>
              <FontAwesome6 name="clock-rotate-left" size={20} color="#333" style={globalStyle.icon} iconStyle="solid" />
              <Text style={globalStyle.menuText}>Mi actividad</Text>
            </TouchableOpacity>

            <TouchableOpacity style={globalStyle.menuItem}
              onPress={() => {
                navigation.navigate("ContactUsScreen");
                toggleModal('modal2');
              }}>
              <FontAwesome6 name="headset" size={20} color="#333" style={globalStyle.icon} iconStyle="solid" />
              <Text style={globalStyle.menuText}>Contáctanos</Text>
            </TouchableOpacity>

            <View style={globalStyle.divider} />
            <View style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20 }}>
              <TouchableOpacity style={globalStyle.menuItem} onPress={() => logOut()}>
                <FontAwesome6 name="right-from-bracket" size={20} color="red" style={globalStyle.icon} iconStyle="solid" />
                <Text style={[globalStyle.menuText, { color: 'red' }]}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
