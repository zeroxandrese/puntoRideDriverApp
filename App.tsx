import './gesture-handler';
import { useEffect } from 'react';
import { AppState, BackHandler } from 'react-native';
import Toast from 'react-native-toast-message';
//import * as Sentry from "@sentry/react-native";
//import { SENTRY_DSN } from "@env";

import { PaperProvider } from 'react-native-paper';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigationRoot } from './src/stacks/StackNavigationRoot';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// Socket management now handled by SocketProvider
import { ErrorBoundary } from './src/components/ErrorBoundary';
import servicioLogger from './src/utils/servicioLogger';
import { SocketProvider } from './src/context/SocketContext';

// Inicialización de Sentry
/* Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0,
  },
}); */


export const App = () => {

  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  // App state changes now handled by gestorSocket

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider
          settings={{
            icon: (props) => <FontAwesome6 {...props} name={props.name as any} iconStyle='solid' 
            size={props.size || 10}
            />
          }}
        >
          <NavigationContainer
            onStateChange={(state) => {
              // Log de navegación en desarrollo
              if (__DEV__ && state) {
                const currentRoute = state.routes[state.index];
                servicioLogger.info(`Navegación: ${currentRoute.name}`, { params: currentRoute.params });
              }
            }}
          >
            <SocketProvider>
              <StackNavigationRoot />
            </SocketProvider>
          </NavigationContainer>
        </PaperProvider>
      </GestureHandlerRootView>
      <Toast />
    </ErrorBoundary>
  )
}

/*export default Sentry.wrap(App);*/