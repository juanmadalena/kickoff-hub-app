import { useRef } from 'react'
import { Animated } from 'react-native';

export const useFade = () => {
    
    const opacity = useRef( new Animated.Value(0) ).current;
    
    const fadeIn = ( duration = 300, delay = 0, callback?: Function ) => {
        Animated.timing(
            opacity,
            {
                toValue: 1,
                delay,
                duration,
                useNativeDriver: true
            }
        ).start( () => callback ? callback() : null );
    }

    const fadeOut = ( duration: number = 300, callback?: Function) => {
        Animated.timing(
            opacity,
            {
                toValue: 0,
                duration,
                useNativeDriver: true
            }
        ).start( () => callback ? callback() : null );
    }


    return {
        opacity,
        fadeIn,
        fadeOut
    }
}