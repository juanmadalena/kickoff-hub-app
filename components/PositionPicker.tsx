import { Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useState } from 'react';

import { Text, View, Button } from './Themed';
import { commonStyles } from '@/styles/authStyle';

const PositionPicker = ({ onSelectPosition, position } : any) => {

    const [positionSelected, setPositionSelected] = useState(position);
    const scaleAnimation = new Animated.Value(1);

    useEffect(() => {
        Animated.timing(scaleAnimation, {
            toValue: 1.1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [positionSelected])

    const handleSelection = ( v: string ) => {
        setPositionSelected(v);
    }
    
    const close = () => {
        onSelectPosition(positionSelected);
    }

    const POSITIONS = [
        { name: 'Goalkeeper', value: 'GK', image: require('../assets/images/positions/goalkeeper-light.png') },
        { name: 'Defense', value: 'DF', image: require('../assets/images/positions/defense-light.png') },
        { name: 'Midfielder', value: 'MF', image: require('../assets/images/positions/midfielder-light.png') },
        { name: 'Striker', value: 'ST', image: require('../assets/images/positions/striker-light.png') },
    ]

    const selectedStyles = {
        transform: [{ scale: scaleAnimation }],
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.04)',
        ...styles.animationContainer
    }

    return (
        <View style={{flex:1, justifyContent:'space-between', flexDirection:'column'}}>
            <View style={{flexDirection:'row', alignItems:'center', marginVertical:10}}>
                <Text style={{fontSize: 20, fontWeight: '500'}}>Select your position</Text>
            </View>
            <View style={styles.container}>
                {
                    POSITIONS.map( (pos, index) => (
                        <TouchableOpacity 
                            style={styles.positionContainer} 
                            key={index}
                            activeOpacity={0.7}    
                            onPress={ () => handleSelection(pos.value)}
                        >
                            <Animated.View style={ positionSelected === pos.value ? selectedStyles : styles.animationContainer }>
                                <Image
                                    source={pos.image}
                                    style={styles.positionImage}
                                />
                                <Text style={styles.positionText}>{pos.name}</Text>
                            </Animated.View>
                        </TouchableOpacity>
                    ))
                }
            </View>
            <View style={styles.buttonContainer}>
                {
                    positionSelected && (
                        <Button style={{width:'35%', height:40, padding:5}} onPress={close}>
                            <Text style={commonStyles.buttonText}> Done </Text>
                        </Button>
                    )
                }
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    positionContainer:{
        height:'48%',
        width:'48%',
        padding:10,
        justifyContent:'space-around',
        borderRadius: 10,   
    },
    positionSelected:{
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    animationContainer:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    positionImage:{
        height: '60%',
        width: '100%',
        objectFit: 'contain'
    },
    positionText:{
        textAlign: 'center',
        fontSize:14,
        fontWeight: '400'
    },
    buttonContainer:{
        height: 60,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
});


export default PositionPicker;