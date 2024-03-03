import { useRef } from "react";
import { Animated } from "react-native";


const useTranslatePosition = ( initialPosition: number) => {
    
    const position = useRef(new Animated.Value(initialPosition)).current;

    const animationIn = () => {
        Animated.timing(position, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const animationOut = () => {
        Animated.timing(position, {
            toValue: initialPosition != 0 ? initialPosition : 40,
            duration: 200,
            useNativeDriver: true
        }).start()
    }
    
    return {
        position,
        animationIn,
        animationOut
    }
};

export default useTranslatePosition;