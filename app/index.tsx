import { Button, View } from 'react-native';
import { router } from 'expo-router';
import ProfilePicture from '@/components/ProfilePicture';
import { MonoText } from '@/components/StyledText';

const index = () => {

    const PIC = 'https://fcb-abj-pre.s3.amazonaws.com/img/jugadors/MESSI.jpg'

    return (
        <View style={{flex:1}}>
            <ProfilePicture uri={PIC} />
            <MonoText>Sera</MonoText>
            <Button title="Go to Home" onPress={() => console.log("pressed")} />
        </View>
    );
};

export default index;