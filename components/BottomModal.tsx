import { memo, useEffect, useRef } from 'react';
import { Modal, StyleSheet, Animated, Dimensions, PanResponder, View as DefaultView } from 'react-native';

import { View, useThemeColor } from '@/components/Themed';

type BottomModalProps = Modal['props'] & {
    visible?: boolean;
    duration?: number;
    children: React.ReactNode;
    modalHeight?: number | "auto" | Animated.Value | `${number}%` | Animated.AnimatedInterpolation<string | number> | Animated.WithAnimatedObject<Animated.AnimatedNode>  | undefined;
    modalBackground?: string;
    allowDragDownToClose?: boolean;
    setVisible?: () => void;
}

const BottomModal = ( props : BottomModalProps ) =>{
    
    const background = useThemeColor({}, 'itemBackground');

    const { visible = true, children, modalHeight = '35%', duration = 300, allowDragDownToClose = false, modalBackground = background, setVisible, ...otherProps } = props as BottomModalProps;

    const { height } = Dimensions.get('screen');

    //Animation for the modal
    const translateY = useRef(new Animated.Value(height)).current;

    useEffect(() => {
        if(visible){
            handleMoveIn(50);
        }
    },[visible])

    const handleMoveIn = (delay: number = 0) => {        
        Animated.timing(translateY, {
            delay: delay,
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
        }).start()
    }

    const handleMoveOut = () => {
        Animated.timing(translateY, {
            toValue: height,
            duration: duration,
            useNativeDriver: true,
        }).start(() => {
            setVisible && setVisible();
        });
    }

    //PanResponder for the modal, to allow drag down to close
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_event, gestureState) => {
                const { dy } = gestureState;
                if (dy > 0) {
                    //If the user is dragging the modal down, update the translateY value
                    translateY.setValue(dy);
                }
            },
            onPanResponderRelease: (_event, gestureState) => {
                const { dy } = gestureState;
                //If the user has dragged the modal down by 20% of the screen height, close the modal
                if (dy > height * 0.2) {
                    handleMoveOut();
                }
            },
            onPanResponderEnd(_event, _gestureState) {
                handleMoveIn()
            }
        })
    ).current;

    return (
        <Modal {...otherProps}>
            <View style={styles.container}>
                <Animated.View { ...allowDragDownToClose && {...panResponder.panHandlers}} style={{...styles.bottomContainer, height: modalHeight , transform: [{translateY:translateY}], zIndex:999}}>
                    <View style={[{ flex:1, borderRadius:25, paddingVertical:14 },{ backgroundColor:modalBackground} ]}>
                        {
                         allowDragDownToClose &&   
                            <DefaultView style={{width:'100%', alignItems:'center', justifyContent:'center'}}>
                                <View style={{backgroundColor:'grey', opacity:0.4, borderRadius:18, width:100, height:5, marginBottom:8}}>
                                </View>
                            </DefaultView>
                        }
                        {children}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderWidth: 1,
    },
    bottomContainer:{
        minHeight: 250,
        width: '100%',
        paddingHorizontal: '2%',
        position: 'absolute',
        bottom: '2%',
        borderRadius: 20,
        zIndex: 100,
    }
});


export default BottomModal;