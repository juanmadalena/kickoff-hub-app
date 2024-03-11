import { useRef } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View as DefaultView } from 'react-native';

import { View, Text } from '@/components/Themed';
import { useBounce } from '@/hooks/useBounce';
import Icon from './Icon';

interface SwipeButtonProps {
  type: 'join' | 'leave' | 'full' | 'disabled',
  onSwiped: () => void,
}

const SwipeButton = ( { onSwiped, type }: SwipeButtonProps ) => {

    let text = '';
    let colors = ['#222222', '#196b54'];
    let disabled = false;

    switch (type) {
      case 'join':
        disabled = false;
        text = 'Swipe to join the match';
        colors = ['#222222', '#196b54'];
        break;
      case 'leave':
        disabled = false;
        text = 'Swipe to leave the match';
        colors = ['#222222', '#d32f2f'];
        break;
      case 'full':
        disabled = false;
        text = 'Match is full';
        colors = ['#222222', '#ff9800'];
        break;
      case 'disabled':
        disabled = true;
        text = 'Match already played';
        colors = ['#222222', '#ff9800'];
        break;
      default:
        disabled = false;
        text = 'Swipe to join the match';
        colors = ['#222222', '#196b54'];
        break;
    }

    // animation values
    const swipeX = useRef(new Animated.Value(0)).current;
    const containerColor = useRef(new Animated.Value(0)).current;

    // custom hook for arrow bounce animation
    const BOUNCE = type === 'join' ? 3.5 : 0;
    const { transformX } = useBounce(BOUNCE, 500);

    // swipe button width
    let { width } = Dimensions.get('window');
    width = (width * 0.9) - 20 - 40;

    // swipe right callback
    const onSwipeRight = () => {
        onSwiped();
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
              onSwipeRight();
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

    const swipeStyles = {
        transform: [
            {
            translateX: swipeX.interpolate({
                inputRange: [0, width ],
                outputRange: [0, width ],
                extrapolate: 'clamp',
            }),
            },
        ],
    };

    const backgroundStyles ={ 
        backgroundColor: containerColor.interpolate({
          inputRange: [0, 255],
          outputRange: colors,
        })
    }

    return (
        <Animated.View  style={[styles.container, !disabled ? {...backgroundStyles} : {opacity:0.8}]}>
          <DefaultView { ...!disabled ? {...panResponder.panHandlers} : ''} style={[styles.innerContainer]}>
          {
            disabled ? 
              <DefaultView style={[ styles.track, {width: '100%'}]}>
                <Text style={{opacity:0.4}}>{ text }</Text>
              </DefaultView>
            :
              <>
                <Animated.View
                    style={[ styles.track, swipeStyles, { width: 40, backgroundColor: 'white'}]}
                >
                    <Animated.View style={{transform: [{translateX: transformX}]}}>
                        <Icon name='arrow-forward' size={24} color='black' />
                    </Animated.View>
                </Animated.View>
                <Text style={styles.placeholder}>{text}</Text>
              </>
          }
          </DefaultView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
  container: {
    position:'absolute', 
    bottom:10, 
    left:20,
    width:'90%', 
    borderRadius:18, 
    padding:10,
    backgroundColor: '#222222',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    height: 40, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex:999
  },
  placeholder: {
    position:'absolute', 
    textAlign:'center', 
    color:'white', 
    fontSize:14, 
    fontWeight:'600', 
    width:'100%'
  }
});

export default SwipeButton;