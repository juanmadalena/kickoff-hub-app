import { useRef } from 'react';
import { View, Text, Animated } from 'react-native';

export const useChangeColor = (initialColor: string, colorToChange: string ) => {
  
    const initial = useRef(new Animated.Value(0)).current;
    const color = useRef(initialColor);

    const changeColor = (duration: number = 300, delay: number = 0, callback?: Function) => {
        Animated.timing(
            initial,
            {
                toValue: 1,
                delay,
                duration,
                useNativeDriver: false
            }
        ).start( () => {
            color.current = colorToChange;
            callback ? callback() : null;
        });
    }

    return {
        initial,
        color,
        changeColor
    }
    
    
};