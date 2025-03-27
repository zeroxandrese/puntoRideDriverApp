import './gesture-handler';
//import * as Sentry from "@sentry/react-native";
//import { SENTRY_DSN } from "@env";

import { PaperProvider } from 'react-native-paper';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigationRoot } from './src/stacks/StackNavigationRoot';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Inicialización de Sentry
/* Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0,
  },
}); */


export const App = () => {
  return (
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
  )
}

/*export default Sentry.wrap(App);*/