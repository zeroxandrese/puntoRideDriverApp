import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import RawErrorBoundary from 'react-native-error-boundary';
import servicioLogger from '../utils/servicioLogger';

const ErrorBoundary = RawErrorBoundary as any; // 💡 Esto soluciona el problema de tipos

const ErrorFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => {
  const [retrying, setRetrying] = React.useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      resetError();
    }, 1000);
  };

  React.useEffect(() => {
    servicioLogger.fatal('Error capturado por ErrorBoundary', error);
  }, [error]);

  return (
    <View style={styles.container}>
      <View style={styles.errorCard}>
        <Text style={styles.title}>¡Ups! Algo salió mal</Text>
        <Text style={styles.message}>
          Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
        </Text>

        {__DEV__ && (
          <ScrollView style={styles.errorDetails}>
            <Text style={styles.errorText}>{error.toString()}</Text>
          </ScrollView>
        )}

        <TouchableOpacity style={styles.button} onPress={handleRetry} disabled={retrying}>
          {retrying ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Reintentar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const AppErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    {children}
  </ErrorBoundary>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center'
  },
  message: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22
  },
  button: {
    backgroundColor: '#FFBC07',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  errorDetails: {
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    maxHeight: 200
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 8
  },
  stackTrace: {
    fontSize: 10,
    color: '#666666',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
  }
});