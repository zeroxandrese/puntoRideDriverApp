
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { View, Text, StyleSheet } from 'react-native';

import { globalStyle } from "../theme/global.style";
import { Location, LatLng, polylineFomart, trip } from '../interface/interface';
import MarkerClient from '../assets/markerClient.svg';
import LocationDot from '../assets/location-dot-solid.svg';
import CarMarker from '../assets/carMarker.svg';
import MotoMarker from '../assets/motoMarker.svg';
import { moveCameraStore } from "../store/Actions/moveCameraStore";

interface Props {
  ShowsUserLocation?: boolean,
  initialLocation: Location,
  polyline: polylineFomart[] | null
  markers: { origin: LatLng; destination: LatLng } | null;
  tripCurrent: trip | null;
  vehicle: string | null | undefined,
  onDestinationChange?: (coords: LatLng) => void
};

const getAngle = (prevPos: LatLng, newPos: LatLng): number => {
  const dx = newPos.longitude - prevPos.longitude;
  const dy = newPos.latitude - prevPos.latitude;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  return angle;
};

export const Maps = ({ ShowsUserLocation = true, initialLocation, polyline, markers, tripCurrent, vehicle, onDestinationChange }: Props) => {

  const { moveKnowLocation } = moveCameraStore();
  const mapRef = useRef<MapView>();
  const cameraLocation = useRef<Location>(initialLocation);
  const [tracksChange, setTracksChange] = useState(true);
  const [carPosition, setCarPosition] = useState<LatLng>({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
  });
  const [prevCarPosition, setPrevCarPosition] = useState<LatLng>({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
  });
  const [carRotation, setCarRotation] = useState<number>(0);

  const moveCameraToLocation = (location: Location) => {
    if (!mapRef.current) return;

    const adjustedLocation = {
      latitude: location.latitude + 0.0015,
      longitude: location.longitude,
    };

    mapRef.current.animateCamera({
      center: adjustedLocation,
      zoom: 16,
    });
  };

  const VehicleMarkerIcon = () => {
    if (vehicle === 'VEHICLE') {
      return <CarMarker width={30} height={30} />;
    } else if (vehicle === 'MOTO') {
      return <MotoMarker width={40} height={40} />;
    } else {
      return null;
    }
  };

  useEffect(() => {
    const newPosition = initialLocation ?? markers?.destination;

    if (newPosition) {
      const prevPosition = carPosition;

      setPrevCarPosition(prevPosition);
      setCarPosition(newPosition);

      const angle = getAngle(prevPosition, newPosition);
      setCarRotation(angle);

      setTracksChange(true);

      const timeoutId = setTimeout(() => {
        setTracksChange(false);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [initialLocation, markers?.destination]);

  useEffect(() => {
    if (moveKnowLocation) {
      moveCameraToLocation(moveKnowLocation)
    }
  }, [moveKnowLocation]);

useEffect(() => {
  if (tripCurrent && initialLocation && mapRef.current) {
    const angle = getAngle(prevCarPosition, initialLocation);

    mapRef.current.animateCamera({
      center: {
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
      },
      pitch: 70,         // Más inclinado
      heading: angle,    // Dirección del vehículo
      zoom: 20,        // Más zoom para acercarse
      altitude: 100      // Más bajo para sensación cercana
    }, { duration: 2000 });

    setPrevCarPosition(initialLocation);
  }
}, [tripCurrent, initialLocation]);

  useEffect(() => {
    setTracksChange(true);

    const timeoutId = setTimeout(() => {
      setTracksChange(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [initialLocation]);

  useEffect(() => {
    console.log(markers)
    console.log('ORIGIN:', markers?.origin);
console.log('DESTINATION:', markers?.destination);
  }, [markers])

  return (
    <View style={{ flex: 1, zIndex: 0 }}>
      <MapView
        ref={(map) => mapRef.current = map!}
        pointerEvents="auto"
        showsUserLocation={ShowsUserLocation}
        showsMyLocationButton={false}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: cameraLocation.current.latitude,
          longitude: cameraLocation.current.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {polyline && polyline.length > 0 && (
          <Polyline
            coordinates={polyline}
            strokeColor="#FFBC07"
            strokeWidth={5}
          />
        )}

        {/* Marker para el origen */}
        <Marker
          coordinate={markers?.origin ?? { latitude: initialLocation.latitude, longitude: initialLocation.longitude }}
          tracksViewChanges={tracksChange}
          rotation={carRotation}
          flat={true}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={{ backgroundColor: 'red', width: 20, height: 20, borderRadius: 10 }} />
        </Marker>
<Marker coordinate={{ latitude: -12.1208513, longitude: -77.0051659 }} >
  <View style={{ backgroundColor: 'black', padding: 4 }}>
    <Text style={{ color: 'white' }}>Test</Text>
  </View>
</Marker>
        {/* Marker para el destino */}
        {tripCurrent?.tripStarted ? (
          <Marker
            coordinate={markers?.destination || {
              latitude: initialLocation.latitude,
              longitude: initialLocation.longitude,
            }}
            tracksViewChanges={tracksChange}
          >
            <LocationDot width={50} height={50} />
          </Marker>
        ) : (
          <Marker
            coordinate={markers?.destination || {
              latitude: initialLocation.latitude,
              longitude: initialLocation.longitude,
            }}
            tracksViewChanges={tracksChange}
          >
            <MarkerClient width={50} height={50} />
          </Marker>
        )}

      </MapView >
    </View>
  )

};