import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSocket } from '../context/SocketContext';

export const IndicadorConexion: React.FC = () => {
  const { estadoConexion, conectado } = useSocket();
  const [visible, setVisible] = useState(false);
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    // Mostrar indicador cuando no está conectado o está reconectando
    const deberiasMostrar = estadoConexion !== 'connected';
    
    if (deberiasMostrar !== visible) {
      if (deberiasMostrar) {
        setVisible(true);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      }
    }
  }, [estadoConexion, opacity, visible]);

  if (!visible) return null;

  const getStatusInfo = () => {
    switch (estadoConexion) {
      case 'connecting':
        return { text: 'Conectando...', color: '#FFA500' };
      case 'reconnecting':
        return { text: 'Reconectando...', color: '#FFA500' };
      case 'disconnected':
        return { text: 'Sin conexión', color: '#FF0000' };
      case 'error':
        return { text: 'Error de conexión', color: '#FF0000' };
      default:
        return { text: '', color: '#FFA500' };
    }
  };

  const { text, color } = getStatusInfo();

  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor: color }]}>
      <View style={styles.content}>
        <View style={styles.dot} />
        <Text style={styles.text}>{text}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 30, // Para safe area
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    opacity: 0.8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});