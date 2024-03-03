import { Dimensions, Image, Modal, StyleSheet } from 'react-native';
import { View, Text } from './Themed';
import { useContext, useState } from 'react';
import { AuthContext } from '@/context/authContext/AuthContext';
import { Player } from '@/interfaces';
import { useFocusEffect } from 'expo-router';

interface Props {
    uri?: string | undefined | null;
    height?: number;
    width?: number;
    player?: Player;
    allowFullScreen?: boolean;
}

const ProfilePicture = ({ uri, height = 50, width = 50, player, allowFullScreen = false }: Props) => {

    const [ showFullScreen, setShowFullScreen ] = useState(false)
    const { height: heightScreen, width: widthScreen } = Dimensions.get('screen');

    let initials: string;
    
    if(player){
        initials = `${player.first_name?.charAt(0).toUpperCase()}${player.last_name?.charAt(0).toUpperCase()}`;
    }else{
        const { user } = useContext( AuthContext )
        initials = `${user?.first_name?.charAt(0).toUpperCase()}${user?.last_name?.charAt(0).toUpperCase()}`;
    }
    
    useFocusEffect(() => {
        setShowFullScreen(false)
    })

    const handleFullScreen = () => {
        if(!allowFullScreen) return
        setShowFullScreen(!showFullScreen)
    }

    return (
        <>
            <View onTouchEnd={handleFullScreen} style={{height, width, backgroundColor:'transparent'}}>
                {
                    uri ?
                        <Image
                        source={{ uri }} 
                        style={[styles.container]}
                        />
                    :
                        <View style={[styles.container]}>
                            <Text style={[styles.text, {fontSize: width/2.8}]}>
                                {initials}
                            </Text>
                        </View>
                }
            </View>
            {
                showFullScreen && uri && allowFullScreen &&
                <Modal onTouchEnd={handleFullScreen} visible={showFullScreen} transparent={true}>
                    <View onTouchEnd={handleFullScreen} style={{height:heightScreen, width:widthScreen, backgroundColor:'rgba(0,0,0,0.8)', justifyContent:'center', alignItems:'center'}}>
                        <Image 
                            source={{ uri }}
                            style={{ width:widthScreen - 40, height: widthScreen - 40, borderRadius:12}}
                        />
                    </View>
                </Modal>
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        height:'100%', 
        width:'100%', 
        borderRadius:400, 
        justifyContent:'center', 
        objectFit:'cover',
        alignItems:'center', 
        backgroundColor:'#005B41'
        // backgroundColor:'yellow',
    },
    text:{
        fontSize:200,
        color:'white', 
        letterSpacing:1,
        fontWeight:'600'
    }
});

export default ProfilePicture;