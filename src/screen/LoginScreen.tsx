import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StatusBar, 
  TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import useAuthStore from "../globalState/globalState";
import { useForm } from '../components/useForm';
import { RootStackParamListInitial } from '../interface/interface';
import { globalStyle } from '../theme/global.style';
import Modal from 'react-native-modal';
import { ActivityIndicator, FAB, TextInput } from 'react-native-paper';

type NavigationProps = StackNavigationProp<RootStackParamListInitial, "Home">;

export const LoginScreen = () => {

  const { signIn } = useAuthStore();
  const navigation = useNavigation<NavigationProps>();
  const [isLoading, setIsLoading] = useState(false);

  const { email, password, code, cambioFormulario } = useForm({
    email: "",
    password: "",
    code: ""
  });

  const [modalVisible, setModalVisible] = useState({
    modal1: false
  });

  const toggleModal = (modalName: string) => {
    setModalVisible((prev) => ({
      ...prev,
      [modalName]: !prev[modalName],
    }));
  };

  const handleLogin = async () => {
    setIsLoading(true);
    if (email === "" && password === "") {
      Alert.alert("Error", "Datos incompletos");
      setIsLoading(false);
    }
    await signIn({ email: email.trim(), password: password.trim() })
    navigation.navigate('Home');
    setIsLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={globalStyle.containerLogin}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFBC07" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1, justifyContent: 'center', width: '90%' }}
        >
          <View style={globalStyle.cardLogin}>
            <Text style={globalStyle.titleLogin}>Driver Inicia Sesión</Text>
            <TextInput
              style={globalStyle.inputLogin}
              textColor='#000000'
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(text) => cambioFormulario(text, 'email')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={globalStyle.inputLogin}
              placeholder="Contraseña"
              textColor='#000000'
              placeholderTextColor="#999"
              value={password}
              onChangeText={(text) => cambioFormulario(text, 'password')}
              secureTextEntry
            />
            {isLoading ?
              <View style={{ marginTop: 10 }}>
                <ActivityIndicator size="large" color="#D99A06" />
              </View>
              :
              <FAB
                label="Login"
                style={globalStyle.buttonLogin}
                disabled={isLoading}
                color={"#FFFFFF"}
                mode="flat"
                onPress={() => handleLogin()}
              />
            }
            <Text style={globalStyle.registerTextLogin}>
              ¿No tienes cuenta?{" "}
              <TouchableOpacity onPress={() => toggleModal("modal1")}>
                <Text style={globalStyle.linkLogin}>Regístrate</Text>
              </TouchableOpacity>
            </Text>
            <View style={{ marginTop: 40, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => Linking.openURL("https://puntorideapp.web.app/")}>
                <Text style={{
                  color: '#000000'
                }}>© 2025 NovaMatrix</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        <Modal
          isVisible={modalVisible.modal1}
          backdropOpacity={0.5}
          onBackdropPress={() => toggleModal("modal1")}
          animationIn="bounceInDown"
          avoidKeyboard={true}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={globalStyle.modalRegisterLogin}>
                <Text style={globalStyle.titleLogin}>Registro de Conductor</Text>
                <TextInput
                  style={globalStyle.inputLogin}
                  placeholder="Correo electrónico"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={(text) => cambioFormulario(text, 'email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={globalStyle.inputLogin}
                  placeholder="Contraseña"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={(text) => cambioFormulario(text, 'password')}
                  secureTextEntry
                />
                <TextInput
                  style={globalStyle.inputLogin}
                  placeholder="Código"
                  placeholderTextColor="#999"
                  value={code}
                  onChangeText={(text) => cambioFormulario(text, 'code')}
                  secureTextEntry
                />
                <FAB label="Enviar" color='#000000' style={globalStyle.buttonLogin} onPress={handleLogin} />
                <FAB
                  label='Cancelar'
                  style={{ backgroundColor: "#666666" }}
                  onPress={() => toggleModal("modal1")}
                />
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};