import { Modal, StyleSheet, Animated } from 'react-native';
import { View, useThemeColor } from './Themed';
import { useEffect } from 'react';

type BottomModalProps = Modal['props'] & {
    visible: boolean;
    children: React.ReactNode;
    modalHeight: number | "auto" | Animated.Value | `${number}%` | Animated.AnimatedInterpolation<string | number> | Animated.WithAnimatedObject<Animated.AnimatedNode> | null | undefined;
    setVisible?: () => void;
}

const BottomModal = ( props : BottomModalProps ) => {
    
    const { visible, children, modalHeight = '35%', setVisible, ...otherProps } = props as BottomModalProps;

    //Animation for the modal
    const translateY = new Animated.Value(200);

    const backgroundColor = useThemeColor({}, 'itemBackground');

    const handleSetVisible = () => {
        console.log('handleSetVisible');
        setVisible ? setVisible() : null;
    }

    useEffect(() => {
        if(visible){
            handleMoveIn();
        }
    },[visible])

    const handleMoveIn = () => {        
        Animated.timing(translateY, {
            delay: 50,
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start()
    }

    const handleMoveOut = (callback?: Function) => {
        Animated.timing(translateY, {
            delay: 0,
            toValue: 300,
            duration: 200,
            useNativeDriver: true,
        }).start( () => callback ? callback() : null)
    }

    // handleMoveIn();

    // useEffect(() => {
    //     if(visible){
    //         handleMoveIn();
    //     }
    // },[visible])


    return (
        <Modal {...otherProps} onTouchStart={() => console.log('nop')}>
            <View style={styles.container}>
                <Animated.View onTouchStart={() => null} style={{...styles.bottomContainer, height: modalHeight ,backgroundColor, transform: [{translateY:translateY}], zIndex:999}}>
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