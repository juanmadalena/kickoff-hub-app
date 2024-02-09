import { Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useState } from 'react';

import { Text, View } from './Themed';

const PositionPicker = ({ onSelectPosition, position } : any) => {

    const [positionSelected, setPositionSelected] = useState(position);
    const scaleAnimation = new Animated.Value(1);

    useEffect(() => {
        Animated.timing(scaleAnimation, {
            toValue: 1.3,
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
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1.5,
        borderRadius: 8,
        borderColor: 'teal',
        ...styles.animationConatiner
    }

    return (
        <View style={{flex:1}}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{textAlign:'left', fontSize: 20, fontWeight: '500'}}>Select your position</Text>
                {
                    positionSelected && (
                        <TouchableOpacity 
                            onPress={close}
                        >
                            <Text style={{fontSize: 18, color: 'teal'}}>Done</Text>
                        </TouchableOpacity>
                    )
                }
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
                            <Animated.View style={ positionSelected === pos.value ? selectedStyles : styles.animationConatiner }>
                                <Image
                                    source={pos.image}
                                    style={styles.positionImage}
                                />
                                <Text style={styles.positionText}>{pos.value}</Text>
                            </Animated.View>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    positionContainer:{
        height:'65%',
        width:'25%',
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
    animationConatiner:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    positionImage:{
        height: '50%',
        width: '100%',
        objectFit: 'contain'
    },
    positionText:{
        textAlign: 'center',
        fontSize:18,
        fontWeight: '400'
    }
});


export default PositionPicker;