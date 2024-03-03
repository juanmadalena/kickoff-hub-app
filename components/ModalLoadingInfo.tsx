import { View, useThemeColor, Text } from '@/components/Themed';
import LoadingComponent from '@/components/LoadingComponent';
import { useFade } from '@/hooks/useFade';
import { Animated } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './Icon';

interface Props {
    status: 'loading' | 'success' | 'error';
}

const ModalLoadingInfo = ( {status}:Props ) => {

    // const [status, setStatus] = useState<Props['status']>('loading');

    const backgroundColor = useThemeColor({}, 'itemBackground');
    const containerColor = useThemeColor({}, 'background');

    const loadingOpacity = useRef(new Animated.Value(1)).current;
    const resultOpacity = useRef(new Animated.Value(0)).current;
    const containerOpacity = useRef(new Animated.Value(0)).current;

    Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
    }).start();

    //animation secuence
    const startTransision = () => {   
        Animated.parallel([
            Animated.timing(loadingOpacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true
            }),
            Animated.timing(resultOpacity, {
                delay: 300,
                toValue: 1,
                duration: 400,
                useNativeDriver: true
            }),
        ]).start();
    }

    useEffect(() => {
        if(status === 'success' || status === 'error'){
            startTransision();
        }
    }, [status])

    return (
        <Animated.View style={{position:'absolute', zIndex:999, backgroundColor:`${containerColor}DD`, height:'100%', width:'100%', top:0, alignItems:'center', justifyContent:'center', opacity: containerOpacity}}>
            <View 
            style={{width:160, height:160, borderRadius:18, backgroundColor: backgroundColor, alignItems:'center', justifyContent:'center'}}>
                <Animated.View style={{opacity: loadingOpacity, position:'absolute'}}>
                    <LoadingComponent />
                </Animated.View>
                <Animated.View style={{opacity: resultOpacity, position:'absolute'}}>
                    <Icon name={status === 'success' ? 'check' : 'close'} size={60} color={status === 'success' ? 'green' : 'maroon'}/>
                </Animated.View>
            </View>
        </Animated.View>
    );
};

export default ModalLoadingInfo;