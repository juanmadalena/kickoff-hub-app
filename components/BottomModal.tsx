import { useEffect } from 'react';
import { Modal, StyleSheet, Animated, Dimensions } from 'react-native';

import { View, useThemeColor } from '@/components/Themed';

type BottomModalProps = Modal['props'] & {
    visible?: boolean;
    duration: number;
    children: React.ReactNode;
    modalHeight: number | "auto" | Animated.Value | `${number}%` | Animated.AnimatedInterpolation<string | number> | Animated.WithAnimatedObject<Animated.AnimatedNode>  | undefined;
    setVisible?: () => void;
}

const BottomModal = ( props : BottomModalProps ) => {
    
    const { visible = true, children, modalHeight = '35%', duration = 300, setVisible, ...otherProps } = props as BottomModalProps;

    const { height } = Dimensions.get('screen');

    //Animation for the modal
    const translateY = new Animated.Value(height);

    const backgroundColor = useThemeColor({}, 'itemBackground');

    useEffect(() => {
        if(visible){
            handleMoveIn();
        }
    },[visible])

    const handleMoveIn = () => {        
        Animated.timing(translateY, {
            delay: 50,
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
        }).start()
    }

    return (
        <Modal {...otherProps}>
            <View style={styles.container}>
                <Animated.View style={{...styles.bottomContainer, height: modalHeight ,backgroundColor, transform: [{translateY:translateY}], zIndex:999}}>
                        {children}
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
        padding: 20,
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        zIndex: 100,
    }
});


export default BottomModal;