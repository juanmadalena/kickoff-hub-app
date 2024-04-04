import { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, Animated, View } from 'react-native';

import { Text, useThemeColor } from './Themed';
import Icon from './Icon';
import { Position } from '@/interfaces';

interface Props {
    onSelectPosition: (position: string) => void;
    position: Position;

}

const PositionPicker = ({ onSelectPosition, position } : Props) => {

    //Get theme
    const imageColor = useThemeColor({}, 'text');

    const backgroundColorSelection = useThemeColor({}, 'selectionBackground');
    const primaryColor = useThemeColor({}, 'primaryColor');

    const [positionSelected, setPositionSelected] = useState<Position>(position);
    const scaleAnimation = new Animated.Value(1);

    useEffect(() => {
        Animated.timing(scaleAnimation, {
            toValue: 1.05,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [positionSelected])

    const handleSelection = ( v: Position ) => {
        setPositionSelected(v);
    }
    
    const close = () => {
        onSelectPosition(positionSelected);
    }

    const POSITIONS = [
        { name: 'Goalkeeper', value: "GK", image: require(`../assets/images/positions/goalkeeper.png`)},
        { name: 'Defense', value: "DF", image: require(`../assets/images/positions/defense.png`)},
        { name: 'Midfielder', value: "MF", image: require(`../assets/images/positions/midfielder.png`)},
        { name: 'Forward', value: "FW", image: require(`../assets/images/positions/striker.png`)},
    ]

    const selectedStyles = {
        transform: [{ scale: scaleAnimation }],
        borderRadius: 8,
        backgroundColor: `${backgroundColorSelection}AA`,
        ...styles.animationContainer
    }

    return (
        <View style={{flex:1, justifyContent:'space-between', flexDirection:'column'}}>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, marginTop:2}}>
                <Text style={{fontSize: 20, fontWeight: '500'}}>Select your position</Text>
                <View style={[styles.buttonContainer]}>
                    <TouchableOpacity disabled={!positionSelected} onPress={close} style={[styles.button, {backgroundColor: !positionSelected ? `${backgroundColorSelection}7F` : primaryColor}]}>
                        <Icon name='arrow-forward-ios' size={18} color='white' style={{ opacity: !positionSelected ? 0.2 : 1}}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.container}>
                {
                    POSITIONS.map( (pos, index) => (
                        <TouchableOpacity 
                            style={styles.positionContainer} 
                            key={index}
                            activeOpacity={0.7}    
                            onPress={ () => handleSelection(pos.value as Position)}
                        >
                            <Animated.View style={ [positionSelected === pos.value ? selectedStyles : styles.animationContainer] }>
                                <Image
                                    tintColor={imageColor}
                                    source={pos.image}
                                    style={styles.positionImage}
                                />
                                <Text style={styles.positionText}>{pos.name}</Text>
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
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    positionImage:{
        height: '60%',
        width: '100%',
        objectFit: 'contain'
    },
    positionText:{
        marginTop: 8,
        textAlign: 'center',
        fontSize:14,
        fontWeight: '500'
    },
    buttonContainer:{
        height:45, 
        width:45,  
    },
    button: {
        flex:1,
        width:'100%',
        paddingLeft:2,
        borderRadius:100, 
        alignItems:'center', 
        justifyContent:'center'
    }
});


export default PositionPicker;