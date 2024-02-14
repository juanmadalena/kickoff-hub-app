import { Image, Keyboard, TouchableWithoutFeedback, useColorScheme } from 'react-native';

import { View } from '@/components/Themed';
import logoLigth from '@/assets/images/logo-light.png';
import logoDark from '@/assets/images/logo-dark.png';

const LogoImage = () => {

    const theme = useColorScheme();

    const logo = theme === 'dark' ? logoDark : logoLigth;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{width: '60%'}}>
                <Image source={logo} style={{ width: '100%', height: 70, alignSelf: 'center'}} />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default LogoImage;