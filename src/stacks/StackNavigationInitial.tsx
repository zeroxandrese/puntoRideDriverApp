import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';

import { RootStackParamList } from '../interface/interface';
import { LoginScreen } from '../screen/LoginScreen';
// import { CodePhoneValidationScreen } from '../screen/CodePhoneValidationScreen';
import { HomeScreen } from '../screen/HomeScreen';
import { PermissionsScreen } from '../screen/PermissionsScreen';
import { userPermissionStore } from '../store/permissions/userPermissionStore';
import useAuthStore from '../globalState/globalState';
import CarLoading from '../components/cardLoading';

const Stack = createStackNavigator<RootStackParamList>();

export const StackNavigationInitial = () => {
  const { locationStatus } = userPermissionStore();
  const { checkToken, status } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      await checkToken();
      setIsLoading(false);
    };

    validateAuth();
  }, []);

  const getInitialRoute = () => {
    if (status === 'authenticated') {
      return locationStatus === 'granted' ? 'HomeScreen' : 'PermissionsScreen';
    }
    return 'Login';
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CarLoading />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="CodePhoneValidation" component={CodePhoneValidationScreen} /> */}
    </Stack.Navigator>
  );
};