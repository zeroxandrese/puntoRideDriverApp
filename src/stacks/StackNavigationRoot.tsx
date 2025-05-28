import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';

import { RootStackParamListInitial } from '../interface/interface';
import { InitialScreen } from '../screen/InitialScreen';
import { LoginScreen } from '../screen/LoginScreen';
import { HomeScreen } from '../screen/HomeScreen';
import { StackNavigationInitial } from './StackNavigationInitial';

const RootStack = createStackNavigator<RootStackParamListInitial>();

export const StackNavigationRoot = () => {

    return (
        <RootStack.Navigator initialRouteName="Initial" screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Initial" component={InitialScreen} />
            <RootStack.Screen name="Home" component={HomeScreen} />
            <RootStack.Screen name="RootStack" component={StackNavigationInitial} />
        </RootStack.Navigator>
    )
};