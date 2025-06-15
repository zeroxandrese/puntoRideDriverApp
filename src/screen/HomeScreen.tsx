import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Keyboard } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSocket, useSocketTrip } from '../context/SocketContext';
import { useSocketEvents } from '../hooks/useSocketEvents';
import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native-paper';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

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
import { ServiceScreen } from '../screen/ServiceScreen';
import { ServiceDetailScreen } from './ServiceDetailScreen';
import useSendLocation from '../components/useSendLocation';
import COBROIMG from '../assets/CobroImg.svg';

type NavigationProps = StackNavigationProp<RootStackParamList, "HomeScreen">;

type ModalName = 'modal1' | 'modal2' | 'modal3';

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
    tripCurrentClient, comments,
    polyline, tripStarted, travelState, set, postCancelTrip,
    getActiveTrip, postAcceptedTrip, getVehicle, endTrip, postTripEnd, getWeeklyEarnigns } = useServiceBusinessStore();
  const { conectado, estadoConexion, emitir } = useSocket();
  const { confirmarViaje } = useSocketTrip();
  const [loadingPay, setLoadingPay] = useState(false);
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);

  // Inicializar listeners de eventos socket
  useSocketEvents();

  const [serviceMarkers, setServiceMarkers] = useState<{ origin: LatLng; destination: LatLng }>({
    origin: { latitude: 0, longitude: 0 },
    destination: { latitude: 0, longitude: 0 }
  });

  const [modalVisible, setModalVisible] = useState<Record<ModalName, boolean>>({
    modal1: false,
    modal2: false,
    modal3: false
  });

  const toggleModal = (modalName: ModalName) => {
    setModalVisible((prev) => ({
      ...prev,
      [modalName]: !prev[modalName],
    }));
  };

  useEffect(() => {
    const checkActiveTrip = async () => {
      try {
        await getActiveTrip();
        await getVehicle();
        await getWeeklyEarnigns();
      } catch (error) {
        console.error("Error al obtener el viaje activo:", error);
      }
    };

    checkActiveTrip();
  }, []);

  useEffect(() => {
    // Emitir confirmación cuando haya un viaje activo y esté conectado
    if (conectado && tripCurrent?.uid) {
      setStatusPanDown(true);
      confirmarViaje(tripCurrent.uid);
    }
  }, [tripCurrent?.uid, conectado, confirmarViaje]);

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

  const postEndTrip = async (uid: string) => {
    setLoadingPay(true);
    if (!uid) {
      return;
    }
    await postTripEnd(uid)
    toggleModal('modal3')
    setLoadingPay(true);
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
                    toggleModal={toggleModal}
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
                      setServiceMarkers({
                        origin: {
                          latitude: tripDetail.latitudeStart,
                          longitude: tripDetail.longitudeStart
                        },
                        destination: {
                          latitude: tripDetail.latitudeEnd,
                          longitude: tripDetail.longitudeEnd
                        },
                      })
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
      {travelState === "sending" && (
        <View style={globalStyle.cancelModalView}>
          <Text style={globalStyle.titleCancelView}>¿Quieres cancelar el viaje?</Text>

          {isLoadingCancel ? (
            <View style={{ marginTop: 20 }}>
              <ActivityIndicator size="small" color="#D99A06" />
            </View>
          ) : (
            <TouchableOpacity style={{ marginHorizontal: 40 }}
              onPress={async () => {

                if (!tripCurrent?.uid) {
                  console.warn("No se encontró un tripId válido para cancelar");
                  return;
                }

                try {
                  setIsLoadingCancel(true);

                  await postCancelTrip(tripCurrent?.uid);

                  bottomSheetRef.current?.snapToIndex(1);
                  setStatusPanDown(false);
                  setServiceMarkers({
                    origin: { latitude: 0, longitude: 0 },
                    destination: { latitude: 0, longitude: 0 }
                  });
                } catch (error) {
                  console.error("❌ Error al cancelar el viaje:", error);
                } finally {
                  setIsLoadingCancel(false);
                }
              }}
            >
              <Text style={{ color: 'red', fontSize: 16 }}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
                navigation.navigate('ProfileScreen');
                toggleModal('modal2');
              }}>
              <FontAwesome6 name="user" size={20} color="#333" style={globalStyle.icon} iconStyle="solid" />
              <Text style={globalStyle.menuText}>Perfil</Text>
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

      <Modal
        isVisible={modalVisible.modal3}
        backdropOpacity={0.5}
        animationIn="bounceInDown"
        animationOut="fadeOutUp"
        useNativeDriver
        style={{ margin: 0, justifyContent: 'flex-start' }}
      >
        <View
          style={{
            marginTop: 80,
            marginHorizontal: 20,
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 24,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <COBROIMG width={250} height={220} />
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333' }}>
              ¡Viaje finalizado!
            </Text>
            <Text style={{ fontSize: 16, color: '#666', marginTop: 8 }}>
              Cobro total al cliente:
            </Text>
            <Text style={{ fontSize: 28, color: '#28a745', fontWeight: 'bold', marginTop: 4 }}>
              ${tripCurrent?.price?.toFixed(2) ?? '0.00'}
            </Text>
            {tripCurrent?.priceWithDiscount && (
              <View
                style={{
                  marginTop: 12,
                  backgroundColor: '#FFF3CD',
                  borderLeftWidth: 4,
                  borderLeftColor: '#FFBC07',
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 14, color: '#856404', fontWeight: '600' }}>
                  🎉 Este viaje tiene un cupón del app
                </Text>
                <Text style={{ fontSize: 16, color: '#000', fontWeight: '700' }}>
                  💸 CUPÓN: ${tripCurrent.priceWithDiscount.toFixed(2)} (cubierto por la app)
                </Text>
              </View>
            )}
          </View>
          {loadingPay ?
            <View style={{ marginTop: 10 }}>
              <ActivityIndicator size="large" color="#D99A06" />
            </View>
            :
            <TouchableOpacity
              style={{
                backgroundColor: '#FFBC07',
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
                marginBottom: 12,
              }}
              onPress={() => {
                if (!tripCurrent) {
                  return;
                }
                postEndTrip(tripCurrent?.uid)
              }
              }
            >
              <Text style={{ color: '#000000', fontSize: 16, fontWeight: 'bold' }}>
                Confirmar cobro
              </Text>
            </TouchableOpacity>
          }

        </View>
      </Modal>

    </>
  );
};
