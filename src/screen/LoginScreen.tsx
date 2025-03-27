import React, { useState, useEffect } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native'
import { FAB, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import useAuthStore from "../globalState/globalState";
import { useForm } from '../components/useForm';
import { RootStackParamList } from '../interface/interface';
import { globalStyle } from '../theme/global.style';
import CarFront from '../assets/carFront.svg';
import LogoOutLine from '../assets/logo.svg';
import SignoGoogle from '../assets/signoGoogle.svg';

type NavigationProps = StackNavigationProp<RootStackParamList, "CodePhoneValidation">;

export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={keyboardVisible}
          >
            <LoginContent navigation={navigation} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const LoginContent = ({ navigation }: { navigation: NavigationProps }) => {
  const { postCodeNumberVerify, codeValidationNumberSecurity, errorMessage } = useAuthStore();

  const { phoneNumber, cambioFormulario } = useForm({
    phoneNumber: "",
  });

  const handleLogin = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "El número de teléfono no puede estar vacío");
      return;
    }

    await postCodeNumberVerify({ phoneNumber: Number(phoneNumber) });
  };

  useEffect(() => {
    if (codeValidationNumberSecurity) {
      navigation.navigate("CodePhoneValidation", { phoneNumber });
    };

  }, [codeValidationNumberSecurity])

  return (
    <SafeAreaView>
      <View style={globalStyle.ContainerInitialScreen}>
        <View style={globalStyle.ContainerGlobalAlingCenter}>
          <CarFront />
        </View>
        <View style={globalStyle.StyleLogoPRLogin}>
          <LogoOutLine width={150} height={100} />
        </View>
        <View style={globalStyle.ContainerTextPhoneNumberLogin}>
          <Text style={globalStyle.StyleTextPhoneNumberLogin}>Phone Number</Text>
        </View>
        <View style={globalStyle.ContainerGlobalAlingCenter}>
          <TextInput
            mode="flat"
            placeholder="412-1234567"
            left={<TextInput.Affix text="+58" />}
            style={globalStyle.StyleTextInputLogin}
            keyboardType="numeric"
            maxLength={11}
            onChangeText={(text) => cambioFormulario(text.replace(/[^0-9]/g, ""), "phoneNumber")}
            value={phoneNumber}
          />
        </View>
        <View style={globalStyle.ContainerSignWithApiLogin}>
          <Text style={globalStyle.TextStyleSignIngLogin}>O inicia sesión con</Text>
          <SignoGoogle width={50} height={50} />
          <FAB
            label="Login"
            style={globalStyle.StyleFABLogin}
            color={"#FFFFFF"}
            mode="flat"
            onPress={() => handleLogin()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};