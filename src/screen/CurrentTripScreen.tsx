import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import dayjs from 'dayjs';
import { ActivityIndicator, FAB, ProgressBar, Text, TextInput } from 'react-native-paper';

import { useServiceBusinessStore } from "../store/business/useServiceBusiness";
import { useForm } from '../components/useForm';
import AvataroutProfile2 from '../assets/avataroutProfile2.svg';
import { globalStyle } from '../theme/global.style';
import { CurrentTripScreenProps, Comments } from '../interface/interface';
import { ComentarioTrip } from '../interface/errores';

const parseEstimatedArrival = (estimatedArrival: string): number => {
  const [value, unit] = estimatedArrival.toLowerCase().split(" ");

  const numericValue = parseInt(value, 10);

  if (isNaN(numericValue)) return 0;

  if (unit.startsWith("hour")) {
    return numericValue * 60;
  }

  return numericValue;
};

export const CurrentTripScreen = ({ trip, tripCurrentVehicle, tripCurrentClient, user, comments, tripStarted, toggleModal }: CurrentTripScreenProps) => {
  const arrivalInMinutes = parseEstimatedArrival(trip.estimatedArrival);
  const arrivalDriver = arrivalInMinutes || 1;
  const initialTime = arrivalDriver * 60;

  const { getCommentsTrip, postCommentsTrip, postDriverArrived, postTripEnd, postTripStarted } = useServiceBusinessStore();

  const scrollRef = useRef<ScrollView>(null);
  const totalTimeRef = useRef(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [seconds, setSeconds] = useState(initialTime);
  const [btnDisable, setBtnDisable] = useState(false)
  const [progress, setProgress] = useState<number>(0);
  const [timerFinished, setTimerFinished] = useState(false);
  const [totalTime, setTotalTime] = useState(initialTime);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const { comment, cambioFormulario } = useForm({
    comment: "",
  });

  useEffect(() => {
    getCommentsTrip(trip.uid)
  }, [])

  useEffect(() => {
    totalTimeRef.current = totalTime;
  }, [totalTime]);

  useEffect(() => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          const next = prev - 1;

          if (next <= 0) {
            if (!trip.driverArrived) {
              const extra = 120;
              setTotalTime(t => {
                const newTotal = t + extra;
                totalTimeRef.current = newTotal;
                return newTotal;
              });
              return extra;
            } else {
              clearInterval(intervalRef.current!);
              intervalRef.current = null;
              setTimerFinished(true);
              return 0;
            }
          }

          setProgress((totalTimeRef.current - next) / totalTimeRef.current);
          return next;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (!comment.trim()) return;
    postCommentsTrip(comment, trip.uid);

    cambioFormulario("", "comment");
  };

  return (
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} 
      >
      <BottomSheetScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
      >
          {tripStarted === true ? (
            <View style={{ marginTop: 16, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={globalStyle.textTitleCurrentTrip}>¡El viaje ya ha comenzado!</Text>
              <Text style={globalStyle.subtitleCurrentTrip}>
                Disfruta el trayecto. Ya estas en camino.
              </Text>

              {btnDisable ? (
                <ActivityIndicator animating={true} color="#D99A06" size="large" style={{ marginTop: 6 }} />
              ) : (
                <>
                  <FAB
                    label='Finalizar viaje'
                    color='#FFBC07'
                    style={{ marginTop: 12 }}
                    onPress={async () => {
                      setBtnDisable(true);
                      toggleModal('modal3')
                      setBtnDisable(false);
                    }}
                  />
                </>
              )
              }
            </View>
          ) : trip.driverArrived ? (
            <View style={{ marginTop: 16, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={globalStyle.textTitleCurrentTrip}>¡Ya has llegado al punto!</Text>
              <Text style={globalStyle.subtitleCurrentTrip}>
                Dirígete al punto de encuentro para comenzar tu viaje. Ya alertamos al cliente.
              </Text>
              {btnDisable ? (
                <ActivityIndicator animating={true} color="#D99A06" size="large" style={{ marginTop: 6 }} />
              ) : (
                <>
                  <FAB
                    label="Empezar viaje"
                    color="#28a745"
                    style={{ marginTop: 12 }}
                    disabled={btnDisable}
                    onPress={async () => {
                      setBtnDisable(true);
                      await postTripStarted(trip.uid);
                      setBtnDisable(false);
                    }}
                  />
                </>
              )
              }
            </View>
          ) : (
            <View>
              <View style={{ marginVertical: 16, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={globalStyle.textTitleCurrentTrip}>¡Ya te encuentras en camino!</Text>
              </View>
              <ProgressBar
                progress={progress}
                color={'#3498db'}
                style={globalStyle.styleProgressBar}
              />
              <View style={globalStyle.timerContainer}>
                <Text style={globalStyle.count}>
                  {minutes}:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
                </Text>
              </View>
              {btnDisable ? (
                <ActivityIndicator animating={true} color="#D99A06" size="large" style={{ marginTop: 6 }} />
              ) : (
                <>
                  <FAB
                    label='Llegaste'
                    color='#FFBC07'
                    onPress={async () => {
                      setBtnDisable(true);
                      await postDriverArrived(trip.uid)
                      setBtnDisable(false);
                    }}
                  />
                </>
              )
              }
            </View>
          )}

          <View style={globalStyle.headerLine} />

          {Array.isArray(comments) && comments.length > 0 && (
            <TouchableOpacity
              onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
              style={{
                marginTop: 12,
                padding: 10,
                backgroundColor: '#F0F0F0',
                borderRadius: 10,
              }}
            >
              <Text style={{ fontWeight: 'bold', marginBottom: 4, color: '#333' }}>Último mensaje:</Text>
              <Text numberOfLines={1} style={{ color: '#333' }}>
                {comments[comments.length - 1]?.comment}
              </Text>
              <Text style={{ fontSize: 10, color: '#888', marginTop: 2 }}>
                Toque para ver más...
              </Text>
            </TouchableOpacity>
          )}

          <View style={globalStyle.containerCard}>

            <Text style={globalStyle.sectionTitle}>Cliente asignado</Text>
            <View style={globalStyle.row}>
              <Text style={globalStyle.label}>Nombre: </Text>
              <Text style={globalStyle.value}>{tripCurrentClient?.name ?? "No disponible"}</Text>
            </View>
          </View>

          <View style={globalStyle.containerCard}>
            <Text style={globalStyle.sectionTitle}>🚗 Vehículo del conductor</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 12 }}>
              <View style={{ flexBasis: '48%', flexGrow: 1 }}>
                <Text style={globalStyle.labelVehicleCurrentTrip}>Modelo</Text>
                <Text style={globalStyle.valueVehicleCurrentTrip}>
                  {tripCurrentVehicle?.model || 'No disponible'}
                </Text>
              </View>

              <View style={{ flexBasis: '48%', flexGrow: 1 }}>
                <Text style={globalStyle.labelVehicleCurrentTrip}>Color</Text>
                <Text style={globalStyle.valueVehicleCurrentTrip}>
                  {tripCurrentVehicle?.color || 'No disponible'}
                </Text>
              </View>

              <View style={{ flexBasis: '48%', flexGrow: 1 }}>
                <Text style={globalStyle.labelVehicleCurrentTrip}>Placa</Text>
                <Text style={globalStyle.valueVehicleCurrentTrip}>
                  {tripCurrentVehicle?.register || 'No disponible'}
                </Text>
              </View>

              <View style={{ flexBasis: '48%', flexGrow: 1 }}>
                <Text style={globalStyle.labelVehicleCurrentTrip}>Marca</Text>
                <Text style={globalStyle.valueVehicleCurrentTrip}>
                  {tripCurrentVehicle?.brand || 'No disponible'}
                </Text>
              </View>
            </View>
          </View>

          <View style={globalStyle.containerCard}>
            <View style={{ marginBottom: 20 }}>
              <Text style={globalStyle.sectionTitle}>🚖 Detalles del viaje</Text>
              <Text style={globalStyle.label}>📍 Origen</Text>
              <Text style={globalStyle.value}>{trip?.addressStart || 'No disponible'}</Text>

              <Text style={globalStyle.label}>🏁 Destino</Text>
              <Text style={globalStyle.value}>{trip?.addressEnd || 'No disponible'}</Text>

              <Text style={globalStyle.label}>💰 Precio</Text>
              <Text style={globalStyle.value}>${trip?.price?.toFixed(2) || '0.00'}</Text>
            </View>
          </View>

          <View style={globalStyle.containerCard}>
            <View style={{ marginBottom: 60 }}>
              <Text style={globalStyle.sectionTitle}>💬 Chat</Text>


              {user && Array.isArray(comments) && comments.length > 0 ? (
                comments.map((item: Comments) => (
                  <View
                    key={item.uid}
                    style={{
                      backgroundColor: item.usersId === user.uid ? '#DCF8C6' : '#FFF',
                      alignSelf: item.usersId === user.uid ? 'flex-end' : 'flex-start',
                      marginVertical: 4,
                      padding: 10,
                      borderRadius: 10,
                      maxWidth: '80%',
                    }}
                  >
                    <Text style={{ color: '#333' }}>{item.comment}</Text>
                    <Text style={{ fontSize: 10, color: '#888', marginTop: 4 }}>
                      {dayjs(item.created).format('HH:mm')}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: '#888', fontStyle: 'italic', marginTop: 8 }}>
                  No hay comentarios aún.
                </Text>
              )}
            </View>
          </View>
        </BottomSheetScrollView>
        <View
          style={[
            globalStyle.containerInputCurrentTrip
          ]}
        >
          <TextInput
            style={[globalStyle.inputComments]}
            placeholder="Escribe un mensaje..."
            value={comment}
            multiline
            onChangeText={(text) => {
              if (text.length <= 255) cambioFormulario(text, "comment");
            }}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!comment.trim()}
            style={{
              backgroundColor: '#FFBC07',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#000', fontWeight: 'bold' }}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
  );
};

