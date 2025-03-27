import React, { useEffect, useMemo, useRef } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import { Maps } from "../components/Maps";
import { useLocationStore } from '../store/location/locationStore';
import CarLoading from '../components/cardLoading';
import { globalStyle } from "../theme/global.style";
import { RequestServiceScreen } from "./RequestServiceScreen";

const HomeScreen = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { lastKnowLocation, getLocation } = useLocationStore();

  const snapPoints = useMemo(() => ["40%", "70%"], []);

  useEffect(() => {
    if (lastKnowLocation === null) {
      getLocation();
    }
  }, []);


  if (lastKnowLocation === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CarLoading />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={globalStyle.GlobalContainerCustom}>
      <View style={StyleSheet.absoluteFillObject}>
        <Maps initialLocation={lastKnowLocation} />
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          keyboardBehavior="interactive"
          snapPoints={snapPoints}
          onChange={(index) => {
            console.log("BottomSheet index:", index);
            if (index === 0) {
              Keyboard.dismiss();  // Cierra el teclado cuando el BottomSheet se minimiza
            }
          }}
          handleIndicatorStyle={globalStyle.handleIndicatorStyleCustom}
          handleStyle={globalStyle.handleStyleCustom}
        >
          <BottomSheetView style={globalStyle.contentContainerBottomSheet}>
            <RequestServiceScreen initialLocation={lastKnowLocation} />
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView >
  );
};

export { HomeScreen };