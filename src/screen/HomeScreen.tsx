import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamListInitial } from '../interface/interface';

type NavigationProps = StackNavigationProp<RootStackParamListInitial, "Initial">;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const handleLogout = () => {
    // Aquí podrías llamar a tu store o navegación para cerrar sesión
    
    Alert.alert('Cerrar sesión', 'Has cerrado sesión exitosamente');
    navigation.navigate('Initial');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la App</Text>

      <Text style={styles.subtitle}>¡Has iniciado sesión correctamente lambebicho!</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 18,
      color: '#fff',
      marginBottom: 30,
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#FFBC07',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 8,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  