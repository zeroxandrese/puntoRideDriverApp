
import React, { useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { View } from 'react-native';
import { globalStyle } from "../theme/global.style";
import { Location } from '../interface/interface';
import MarkerClient from '../assets/markerClient.svg';
import { moveCameraStore } from "../store/Actions/moveCameraStore";

interface Props {
  ShowsUserLocation?: boolean,
  initialLocation: Location
}

export const Maps = ({ ShowsUserLocation = true, initialLocation }: Props) => {

  const { moveKnowLocation } = moveCameraStore();
  const mapRef = useRef<MapView>();
  const cameraLocation = useRef<Location>(initialLocation);

  const moveCameraToLocation = (Location: Location) => {
    if (!mapRef.current) return null;
    mapRef.current.animateCamera({ center: Location })
  };

  useEffect(() => {
    if (moveKnowLocation) {
      moveCameraToLocation(moveKnowLocation)
    }
  }, [moveKnowLocation])


  return (
    <View style={{ flex: 1, zIndex: 0 }}>
      <MapView
        ref={(map) => mapRef.current = map!}
        pointerEvents="none"
        showsUserLocation={ShowsUserLocation}
        showsMyLocationButton={false}
        style={globalStyle.map}
        initialRegion={{
          latitude: cameraLocation.current.latitude,
          longitude: cameraLocation.current.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: initialLocation.latitude, longitude: initialLocation.longitude }}>
          <MarkerClient width={50} height={50} />
        </Marker>
      </MapView >
    </View>
  )

};