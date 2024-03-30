import { useRef } from 'react';
import { View, Text, PanResponder, Animated, Dimensions } from 'react-native';

const usePanResponder = () => {

    const swipeX = useRef(new Animated.Value(0)).current;
    const containerColor = useRef(new Animated.Value(0)).current;
    const { width } = Dimensions.get('window');

    const handleMutation = () => {
        console.log('mutation');
    }

    const panResponder = useRef(
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onPanResponderMove: (_event, gestureState) => {
            const { dx } = gestureState;
            if (dx > 0) {
              swipeX.setValue(dx);
              containerColor.setValue(dx);
            }
          },
          onPanResponderRelease: (_event, gestureState) => {
            containerColor.setValue(0);
            const { dx } = gestureState;
            if (dx > width * 0.7) {
              handleMutation();
            }
            Animated.timing(swipeX, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }).start();
          },
          onPanResponderTerminate(_event, gestureState) {
            containerColor.setValue(0);
            Animated.timing(swipeX, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }).start();
          }
        })
      ).current;
};

export default usePanResponder;