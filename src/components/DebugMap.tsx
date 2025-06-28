import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function DebugMap() {
  const test = { latitude: -12.1593006, longitude: -76.96525548 };
  const [region] = useState({
    ...test,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  });
  return (
    <View style={styles.container}>
      <Text style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, color: 'red' }}>
        👀 DEBUG MAP
      </Text>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onMapReady={() => console.log('🌍 map ready')}
      >
        <Marker
          coordinate={test}
          title="Test"
          description="Aquí debería verse"
          pinColor="blue"
          onPress={() => console.log('🔵 marker pressed')}
        />
        <Marker
          coordinate={{ latitude: -12.1593006, longitude: -76.96525548 }}
          pinColor="red"
          style={{ width: 50, height: 50 }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 }
});