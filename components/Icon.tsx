import { useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface IconProps {
    name: React.ComponentProps<typeof MaterialIcons>['name'];
    size?: number;
    color?: string;
    // style?: StyleProp<TextProps['style']>;
    style?: React.ComponentProps<typeof MaterialIcons>['style'];
}

const Icon = ( { name, size = 25 , color, style }: IconProps ) => {

    const colorScheme = useColorScheme()

    return (
        <MaterialIcons name={name} size={size} color={color ?? Colors[colorScheme ?? 'light'].text} style={style} />
    );
};

export default Icon;