import React from "react";
import { View, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";

import CarAnimated from '../assets/CarAnimated.svg';

const CarLoading = () => {
    const translateX = useSharedValue(0);

    React.useEffect(() => {
        translateX.value = withRepeat(
            withTiming(10, { duration: 500, easing: Easing.linear }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Animated.View style={[animatedStyle]}>
                <CarAnimated width={70} height={70} />
            </Animated.View>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Cargando...</Text>
        </View>
    );
};

export default CarLoading;