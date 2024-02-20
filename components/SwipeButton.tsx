import { View, Text } from '@/components/Themed';
import { useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder } from 'react-native';
import Icon from './Icon';
import { useBounce } from '@/hooks/useBounce';

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
    const { transformX } = useBounce(2.5, 500);

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
        <Animated.View  style={{position:'absolute', bottom:10, left:20,width:'90%', borderRadius:18, padding:10, ...backgroundStyles}}>
          <View {...panResponder.panHandlers} style={{backgroundColor:'transparent', flexDirection:'row', alignItems:'center'}}>
          {
            disabled ? 
              <View style={{height: 40, width: '100%', backgroundColor:'transparent', borderRadius: 12, justifyContent: 'center', alignItems: 'center', zIndex:999}}>
                <Text style={{opacity:0.4}}>{ text }</Text>
              </View>
            :
              <>
                <Animated.View
                    style={[{height: 40, width: 40, backgroundColor: 'white', borderRadius: 12, justifyContent: 'center', alignItems: 'center', zIndex:999}, swipeStyles]}
                >
                    <Animated.View style={{transform: [{translateX: transformX}]}}>
                        <Icon name='arrow-forward' size={24} color='black' />
                    </Animated.View>
                </Animated.View>
                <Text style={{position:'absolute', textAlign:'center', color:'white', fontSize:14, fontWeight:'600', width:'100%'}}>{text}</Text>
              </>
          }
          </View>
        </Animated.View>
    );
};

export default SwipeButton;