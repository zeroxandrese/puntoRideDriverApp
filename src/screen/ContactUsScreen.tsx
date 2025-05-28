import React from 'react';
import { View, Platform, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { FAB, TextInput, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

import { RootStackParamList } from '../interface/interface';
import { useForm } from '../components/useForm';
import { globalStyle } from '../theme/global.style';
import CarFront from '../assets/carFront.svg';
import ArrowBack from '../assets/arrowBack.svg';
import { useServiceBusinessStore } from '../store/business/useServiceBusiness';

type NavigationProps = StackNavigationProp<RootStackParamList, "HomeScreen">;

interface PropsToast {
    type: string;
    title: string;
    message: string;
    visibilityTime: number;
};

const showToast = ({ type, title, message, visibilityTime }: PropsToast) => {
    Toast.show({
        type: type,
        text1: title,
        text2: message,
        visibilityTime: visibilityTime
    });
};

export const ContactUsScreen = () => {

    const { postContactUs } = useServiceBusinessStore();
    const navigation = useNavigation<NavigationProps>();
    const { messageContact, cambioFormulario } = useForm({
        messageContact: "",
    });

    const handleSend = () => {
        if (!messageContact.trim()) {
            showToast({
                type: "error",
                title: "¡Mensaje en blanco!",
                message: "Necesitas enviar un mensaje.",
                visibilityTime: 6000
            });
            return;
        }

        postContactUs(messageContact);
        Keyboard.dismiss();
        cambioFormulario("", "messageContact");
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "#EDF9FD" }}
        >
            <View style={globalStyle.containerContactUs}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ width: 60 }}
                >
                    <ArrowBack width={60} height={60} />
                </TouchableOpacity>
                <View style={globalStyle.containerContactUsChildren}>
                    <Text style={globalStyle.titleContactUs}>Contáctanos</Text>
                    <View style={globalStyle.headerLine} />
                    <Text style={globalStyle.subtitleContactUs}>¿En qué podemos ayudarte?</Text>
                    <TextInput
                        value={messageContact}
                        onChangeText={(text) => {
                            if (text.length <= 255) cambioFormulario(text, "messageContact");
                        }}
                        placeholder="Escribe tu mensaje aquí..."
                        style={globalStyle.inputContactUs}
                        multiline
                        numberOfLines={5}
                        textColor='#666'
                    />
                    <FAB label="Enviar"
                        onPress={handleSend}
                        style={{ backgroundColor: "#4A4A4A", marginVertical: 16 }}
                        color='#FFFFFF'
                    />
                    <View style={globalStyle.ContainerGlobalAlingCenter}>
                        <View style={{ marginTop: 80 }}>
                            <CarFront />
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};