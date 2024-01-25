import { View, Image, StyleSheet } from 'react-native';

interface Props {
    uri: string;
    height?: number;
    width?: number;
}

const ProfilePicture = ({ uri, height = 80, width = 80 }: Props) => {
    return (
        <View style={{height, width}}>
            <Image
                source={{ uri }} 
                style={styles.image}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 100,
        width: 100,
        borderWidth: 1,
        borderColor: 'red',
    },
    image: {
        flex: 1,
        borderRadius: 50,
    },
});

export default ProfilePicture;