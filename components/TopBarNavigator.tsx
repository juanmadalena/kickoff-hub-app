import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useThemeColor } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Icon from './Icon';
import { MaterialIcons } from '@expo/vector-icons';

interface topBarNavigatorProps {
    goBackAction?: () => void;
    icon?: React.ComponentProps<typeof MaterialIcons>['name'];
    iconSize?: number;
    disabled?: boolean;
    activeColor?: boolean;
    action?: () => void;
    title?: string;
}

const TopBarNavigator = ( {title, icon, iconSize, activeColor = false, disabled = false, action, goBackAction } : topBarNavigatorProps) => {

    const router = useRouter()
    const backgroundColor = useThemeColor({}, 'itemBackground');
    const primaryColor = useThemeColor({}, 'primaryColor');
    
    const handleGoBack = () => {
        goBackAction ? goBackAction() : router.back();
    }

    return (
        <View style={[styles.container]}>
            <TouchableOpacity style={[styles.backContainer, {backgroundColor}]} onPress={handleGoBack}>
                <Icon name='arrow-back' size={24} />
            </TouchableOpacity>
            {
                title &&
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontSize:20, fontWeight:'bold'}}>{title}</Text>
                </View>
            }
            {
                icon && 
                <TouchableOpacity disabled={disabled} style={[styles.backContainer, {backgroundColor: activeColor && !disabled ? `${primaryColor}AA` : backgroundColor, opacity: disabled ? 0.4 : 1}]} onPress={action}>
                    <Icon name={icon} size={iconSize} />
                </TouchableOpacity>
            }
        </View> 
    );
};


const styles = StyleSheet.create({
    container: { 
        paddingHorizontal: 12,
        width: '100%',
        justifyContent: 'space-between', 
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom:6,
        backgroundColor: 'transparent',
    },
    backContainer: {
        height: 50,
        width: 50,
        borderRadius: 120,
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default TopBarNavigator;