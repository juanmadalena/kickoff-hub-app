import { Image, StyleSheet } from 'react-native';
import { View, Text } from './Themed';
import { useContext, useState } from 'react';
import { AuthContext } from '@/context/authContext/AuthContext';

interface Props {
    uri?: string | undefined | null;
    height?: number;
    width?: number;
}

const ProfilePicture = ({ uri, height = 50, width = 50 }: Props) => {

    const { user } = useContext( AuthContext )
    const initials = `${user?.first_name?.charAt(0).toUpperCase()}${user?.last_name?.charAt(0).toUpperCase()}`;

    // uri = 'https://img.a.transfermarkt.technology/portrait/big/28003-1694590254.jpg?lm=1';


    return (
        <View style={{height, width, backgroundColor:'transparent'}}>
            {
                uri ?
                    <Image
                    source={{ uri }} 
                    style={[styles.container]}
                    />
                :
                    <View style={[styles.container]}>
                        <Text style={[styles.text]}>
                            {initials}
                        </Text>
                    </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height:'100%', 
        width:'100%', 
        borderRadius:40, 
        justifyContent:'center', 
        objectFit:'fill',
        alignItems:'center', 
        // backgroundColor:'#005B41'
        backgroundColor:'yellow'
    },
    text:{
        fontSize:18, 
        color:'black', 
        letterSpacing:1,
        fontWeight:'600'
    }
});

export default ProfilePicture;