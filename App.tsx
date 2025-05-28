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
import { socket } from '../puntoRideDriverApp/src/utils/socketioClient';

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

  useEffect(() => {
    const handleAppStateChange = (state: string) => {
      if (state === "active") {
        if (!socket.connected) {
          console.log("🔄 App volvió al frente, reconectando socket...");
          socket.connect();
        }
      }
    };

    const sub = AppState.addEventListener("change", handleAppStateChange);
    return () => sub.remove();
  }, []);

  return (
    <>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider
        settings={{
          icon: (props) => <FontAwesome6 {...props} name={props.name as any} iconStyle='solid' 
          size={props.size || 10}
          />
        }}
      >
        <NavigationContainer>
          <StackNavigationRoot />
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
    <Toast />
    </>
  )
}

/*export default Sentry.wrap(App);*/