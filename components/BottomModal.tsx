import { Modal, StyleSheet, Animated } from 'react-native';
import { View, useThemeColor } from './Themed';
import { useEffect, useLayoutEffect } from 'react';

type BottomModalProps = Modal['props'] | {
    visible: boolean;
    animationOut?: () => void;
    children: React.ReactNode;
    setVisible: (visible: boolean) => void;
}

const BottomModal = ( props : BottomModalProps ) => {
    
    const { children,  ...otherProps } = props;

    const backgroundColor = useThemeColor({}, 'background');

    //Animation for the modal
    const translateY = new Animated.Value(300);

    Animated.timing(translateY, {
        delay: 50,
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
    }).start()

    return (
        <Modal {...otherProps}>
            <View style={styles.container}>
                <Animated.View style={{...styles.bottomContainer, backgroundColor, transform: [{translateY:translateY}]}}>
                    {children}
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    bottomContainer:{
        minHeight: 250,
        maxHeight: 600,
        height: '30%',
        padding: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    }
});


export default BottomModal;