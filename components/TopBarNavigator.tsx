import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Icon from './Icon';
import { MaterialIcons } from '@expo/vector-icons';

interface topBarNavigatorProps {
    icon?: React.ComponentProps<typeof MaterialIcons>['name'];
    iconSize?: number;
    disabled?: boolean;
    activeColor?: boolean;
    action?: () => void;
}

const TopBarNavigator = ( {icon, iconSize, activeColor = false, disabled = false, action } : topBarNavigatorProps) => {

    const router = useRouter()
    const backgroundColor = useThemeColor({}, 'itemBackground');
    const primaryColor = useThemeColor({}, 'primaryColor');

    return (
        <View style={[styles.container]}>
            <TouchableOpacity style={[styles.backContainer, {backgroundColor}]} onPress={() => router.back()}>
                <Icon name='arrow-back' size={24} />
            </TouchableOpacity>
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