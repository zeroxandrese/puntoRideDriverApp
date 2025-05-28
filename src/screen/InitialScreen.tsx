import React, { useEffect } from 'react';
import { View, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamListInitial } from '../interface/interface';
import LogoOutLine from '../assets/LogoDriver.svg';

type NavigationProps = StackNavigationProp<RootStackParamListInitial, "RootStack">;

export const InitialScreen = () => {
  const scale = new Animated.Value(1);
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1.5,
      duration: 6000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
       navigation.navigate("RootStack");
    });
  }, []);

  return (
    <View style={{ backgroundColor: '#FFC324', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <LogoOutLine width={250} height={220} />
      </Animated.View>
    </View>
  )
}
