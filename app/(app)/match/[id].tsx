import { Image, ScrollView, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import TopBarNavigator from '@/components/TopBarNavigator';

const Match = () => {

    const URL = "https://joomly.net/frontend/web/images/googlemap/map.png"

    return (
        <View>
            <TopBarNavigator />
            <ScrollView style={{height:'100%'}} bounces={false}>
                <View style={styles.mapContainer}>
                    <Image
                        style={styles.map}
                        source={{ uri: URL }} 
                    />
                </View>
                <View style={styles.paddingHorizontal}>
                    <Text style={styles.title}>Location</Text>
                    <Text style={styles.description}>Descripcion</Text>
                </View>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    mapContainer: {
        height: 260,
        width: '100%',
        marginBottom: 10,
    },
    map: {
        height: '100%',
        width: '100%',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    paddingHorizontal:{
        paddingHorizontal: 8,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 20,
    }
});


export default Match;