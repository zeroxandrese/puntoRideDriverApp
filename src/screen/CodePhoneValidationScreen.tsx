import React, { useState, useEffect, useRef } from 'react';
import {
    KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar,
    Text, View, Alert, TouchableWithoutFeedback, TextInput as TextReactNative
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { FAB, TextInput } from 'react-native-paper';

import useAuthStore from "../globalState/globalState";
import { globalStyle } from '../theme/global.style';
import { useForm } from '../components/useForm';
import { RootStackParamList } from '../interface/interface';
import IconCheck from '../assets/IconCheck.svg';
import CarLateral from '../assets/LateralCar.svg';

type NavigationProps = StackNavigationProp<RootStackParamList, "HomeScreen">;
type CodePhoneValidationRouteProp = RouteProp<RootStackParamList, "CodePhoneValidation">;

type InputField = "input1" | "input2" | "input3" | "input4" | "input5";

export const CodePhoneValidationScreen = () => {
    const navigation = useNavigation<NavigationProps>();
    const { postCodeCreateUserValidation, codeValidationNumberSecurity, token, postCodeNumberVerify, status } = useAuthStore();

    const route = useRoute<CodePhoneValidationRouteProp>();
    const { phoneNumber } = route.params;

    const input1Ref = useRef<TextReactNative>(null);
    const input2Ref = useRef<TextReactNative>(null);
    const input3Ref = useRef<TextReactNative>(null);
    const input4Ref = useRef<TextReactNative>(null);
    const input5Ref = useRef<TextReactNative>(null);

    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);

    const { input1, input2, input3, input4, input5, cambioFormulario } = useForm({
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        input5: ''
    });

    const initialTime = 2.5 * 60;
    const [seconds, setSeconds] = useState(initialTime);
    const [timerFinished, setTimerFinished] = useState(false);
    const [code, setCode] = useState('');

    useEffect(() => {
        if (seconds === initialTime) {
            setTimerFinished(false);
        }

        if (seconds > 0) {
            const interval = setInterval(() => {
                setSeconds(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setTimerFinished(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [seconds]);

    useEffect(() => {
        if (status === "authenticated") {
            navigation.navigate("HomeScreen")
        }

    }, [status]);

    useEffect(() => {
        if ([input1, input2, input3, input4, input5].every(input => input !== '')) {
            const combinedCode = `${input1}${input2}${input3}${input4}${input5}`;
            setCode(combinedCode);
        }
    }, [input1, input2, input3, input4, input5]);
    
    useEffect(() => {
        if (code && codeValidationNumberSecurity) {
            postCodeCreateUserValidation({ code, codeValidationNumberSecurity });
        }
    }, [code, codeValidationNumberSecurity]);


    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const resetTimer = () => {
        setSeconds(initialTime);
    };

    const handleInputChange = (
        value: string,
        field: InputField,
        nextRef?: React.RefObject<TextReactNative>
    ) => {
        const limitedValue = value.slice(0, 1);
        cambioFormulario(limitedValue, field);
    
        if (limitedValue && nextRef?.current) {
            nextRef.current.focus();
        }
    };

    const resendCode = async () => {
        ["input1", "input2", "input3", "input4", "input5"].forEach((field) => {
            cambioFormulario("", field as "input1" | "input2" | "input3" | "input4" | "input5");
        });

        if (isBlocked) {
            Alert.alert("Bloqueado", "Has excedido el número de intentos. Intenta en 5 minutos.");
            return;
        }

        if (phoneNumber.trim()) {

            try {
                await postCodeNumberVerify({ phoneNumber: Number(phoneNumber) });

                if (codeValidationNumberSecurity) {
                    setFailedAttempts(prev => prev + 1);
                    resetTimer();
                }

            } catch (error) {
                console.log(error);
                setFailedAttempts(prev => prev + 1);
            }

            if (failedAttempts + 1 >= 3) {
                setIsBlocked(true);
                setTimeout(() => {
                    setFailedAttempts(0);
                    setIsBlocked(false);
                }, 5 * 60 * 1000);
            }
        }
    };

    return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, backgroundColor: "#EDF9FD" }}
            >
                <ScrollView style={{ flex: 1 }}>
                    <StatusBar backgroundColor="#FFBC07" barStyle="dark-content" />
                    <SafeAreaView>
                        <View style={globalStyle.ContainarCenterWithBackgroundGenral}>
                            <Text style={globalStyle.textInfo}>Código de verificación</Text>
                            <Text style={globalStyle.textDescription}>Ingresa el código de verificación enviado al número asociado.</Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <View style={globalStyle.containerInput}>
                                    <TextInput
                                        ref={input1Ref}
                                        style={globalStyle.inputEdad}
                                        keyboardType="numeric"
                                        value={input1}
                                        onChangeText={(value) => handleInputChange(value, 'input1', input2Ref)}
                                    />
                                    {token
                                        ? <IconCheck />
                                        : null
                                    }
                                </View>
                                <View style={globalStyle.containerInput}>
                                    <TextInput
                                        ref={input2Ref}
                                        style={globalStyle.inputEdad}
                                        keyboardType="numeric"
                                        value={input2}
                                        onChangeText={(value) => handleInputChange(value, 'input2', input3Ref)}
                                    />
                                    {token
                                        ? <IconCheck />
                                        : null
                                    }
                                </View>
                                <View style={globalStyle.containerInput}>
                                    <TextInput
                                        ref={input3Ref}
                                        style={globalStyle.inputEdad}
                                        keyboardType="numeric"
                                        value={input3}
                                        onChangeText={(value) => handleInputChange(value, 'input3', input4Ref)}
                                    />
                                    {token
                                        ? <IconCheck />
                                        : null
                                    }
                                </View>
                                <View style={globalStyle.containerInput}>
                                    <TextInput
                                        ref={input4Ref}
                                        style={globalStyle.inputEdad}
                                        keyboardType="numeric"
                                        value={input4}
                                        onChangeText={(value) => handleInputChange(value, 'input4', input5Ref)}
                                    />
                                    {token
                                        ? <IconCheck />
                                        : null
                                    }
                                </View>
                                <View style={globalStyle.containerInput}>
                                    <TextInput
                                        ref={input5Ref}
                                        style={globalStyle.inputEdad}
                                        keyboardType="numeric"
                                        value={input5}
                                        onChangeText={(value) => handleInputChange(value, 'input5')}
                                    />
                                    {token
                                        ? <IconCheck />
                                        : null
                                    }
                                </View>
                            </View>
                            <View style={{ alignItems: 'center', marginTop: 16 }}>
                                <Text style={globalStyle.count}>
                                    {minutes}:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
                                </Text>
                            </View>
                            <View style={{ flex: 1, marginVertical: 16 }}>
                                <Text style={globalStyle.textDescription2}>¿No has  recibido el código de verificación?</Text>
                            </View>
                            <FAB
                                onPress={() => timerFinished ? resendCode() : null}
                                label={timerFinished ? "¿Reenviar código de verificación?" : "Espera antes de reenviar el código"}
                                accessibilityLabel="Botón para reenviar código de verificación"
                                style={{ backgroundColor: "#4A4A4A", marginVertical: 16 }}
                                color='#FFFFFF'
                            />
                            <View style={globalStyle.containerCarLateral}>
                                <CarLateral />
                            </View>
                        </View>
                    </SafeAreaView>
                </ScrollView >
            </KeyboardAvoidingView>
    )
}
