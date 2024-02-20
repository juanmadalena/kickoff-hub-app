import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const useBounce = (value: number, delay: number) => {
    const transformX = useRef( new Animated.Value(0) ).current;
    
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(transformX, {
                    toValue: value,
                    duration: delay,
                    useNativeDriver: true
                }),
                Animated.timing(transformX, {
                    toValue: 0,
                    duration: delay,
                    useNativeDriver: true
                })
            ])
        ).start();
    }, [value, delay]);

    return {
        transformX
    }
}
