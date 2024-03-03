import { ActivityIndicator, Animated } from 'react-native';
import { UseMutationResult } from '@tanstack/react-query';

import { View, Text, useThemeColor } from '@/components/Themed';
import Icon from '@/components/Icon';
import { useFade } from '@/hooks/useFade';
import { useEffect } from 'react';
import LoadingComponent from './LoadingComponent';

interface MutationStatusProps {
    mutation: UseMutationResult<any, Error, void, unknown>;
    successMessage?: string;
}

const MutationStatus = ({ mutation, successMessage }: MutationStatusProps) => {
    
    const { isError, isSuccess, isPending } = mutation;

    const { opacity, fadeIn } = useFade();

    const color = useThemeColor({}, 'primaryColor');

    useEffect(() => {
        fadeIn();
    }, []);

    return (
        <View style={{flex:1, backgroundColor:'transparent'}}>
            <Animated.View style={{opacity, alignItems:'center', justifyContent:'center', height:'90%'}}>
            {
                isPending ?
                <>
                    <LoadingComponent size={'small'}/>
                </>
                :
                isError ?
                <>
                    <Icon name='close' size={60} color='rgba(255,0,0,0.5)' />
                </>
                :
                isSuccess &&
                <>
                    <Icon name='check' size={80} color={color} />
                    <Text style={{opacity:0.8, fontSize:18}} >{successMessage}</Text>
                </>

            }
            </Animated.View>
        </View>
    );
};

export default MutationStatus;