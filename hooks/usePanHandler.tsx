// import { View, Text } from 'react-native';

// export const usePanHandler = () => {
  
//     const panResponder = useRef(
//         PanResponder.create({
//           onStartShouldSetPanResponder: () => true,
//           onPanResponderMove: (_event, gestureState) => {
//             const { dx } = gestureState;
//             if (dx > 0) {
//               swipeX.setValue(dx);
//               containerColor.setValue(dx);
//             }
//           },
//           onPanResponderRelease: (_event, gestureState) => {
//             containerColor.setValue(0);
//             const { dx } = gestureState;
//             if (dx > width * 0.7) {
//               onSwipeRight();
//             }
//             Animated.timing(swipeX, {
//               toValue: 0,
//               duration: 300,
//               useNativeDriver: false,
//             }).start();
//           },
//           onPanResponderTerminate(_event, gestureState) {
//             containerColor.setValue(0);
//             Animated.timing(swipeX, {
//                 toValue: 0,
//                 duration: 300,
//                 useNativeDriver: false,
//               }).start();
//           }
//         })
//       ).current;
  
//     return (
//         <View>
//             <Text>usePanHandler</Text>
//         </View>
//     );
// };