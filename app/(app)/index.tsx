import { useContext, useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';
import DatePicker from '@/components/DatePicker';
import MatchItem from '@/components/MatchItem';
import { AuthContext } from '@/context/authContext/AuthContext';
import { api } from '@/api/api';
import { router } from 'expo-router';
import ProfilePicture from '@/components/ProfilePicture';
import Icon from '@/components/Icon';

const index = () => {

    const { logout, status, user } = useContext( AuthContext )

    const [matches, setMatches] = useState([])

    useEffect(() => {
        fetchMatches()
    }, [])

    const fetchMatches = async () => {
        try{
            const date = new Date()
            const { data: { matches } } = await api.get(`/matches?date=${date.toISOString()}`)
            setMatches(matches)
        }
        catch(e){
            console.log("error2", e);
        }
    }

    const handlelogout = () => {
        logout()
    }

    const PIC = 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'

    return (
        <View style={styles.container}>
            <View style={[styles.topBar, styles.paddingHorizontal]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/')}>
                        <ProfilePicture uri={PIC} />
                    </TouchableOpacity>
                </View>
                <View style={{padding: 6, borderRadius: 30, backgroundColor:'grey'}}>
                    <Icon name='notifications-none' color={'white'} size={24} />
                </View>
            </View>
            {/* Title */}
            <View style={[styles.paddingHorizontal, styles.titleContainer]}>
                <Text style={styles.title}>Upcoming </Text>
                <Text style={styles.title}>Matches</Text>
                {/* <Text>Welcome: {user?.username}</Text>
                <Button title="fetch matches" onPress={fetchMatches} /> */}
                <Button title="Logout" onPress={handlelogout} />
            </View>
            {/* Date picker */}
            <View style={[styles.datePickerContainer, styles.paddingHorizontal]}>
                <DatePicker />
            </View>
            {/* Matches list */}
            {/* <Text style={{fontSize: 14, fontWeight: '600', paddingHorizontal: 16, marginBottom:4 }}>Recommended</Text> */}
            <FlatList
                data={matches}
                renderItem={({item, index}) => <MatchItem  match={item} index={index}/>}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                style={styles.matchesList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop:10,
        height:'100%', 
        flex:1,
    },
    datePickerContainer:{
        paddingVertical: 8, 
        marginBottom:6
    },
    paddingHorizontal: {
        paddingHorizontal: 12,
    },
    topBar: {
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleContainer: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 40,
        fontWeight: '600',
    },
    matchesList: {
        paddingHorizontal: 10,
        flex: 1,
    }
})

export default index;