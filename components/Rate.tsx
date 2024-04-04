import { TouchableOpacity, View } from 'react-native';
import Icon from './Icon';
import { useEffect, useState } from 'react';
import { useThemeColor } from '@/components/Themed';

type RateProps = {
    rate: number;
    onChange: (value: number) => void;
};

const Rate = ( { rate, onChange }: RateProps ) => {
    const [rateValue, setRateValue] = useState(rate);

    const color = useThemeColor({}, 'starsColor');

    useEffect(() => {
        setRateValue(rate);
    }, [rate])

    const handleRate = (value: number) => {
        if(rate != null) return;
        setRateValue(value);
        onChange(value);
    }

    return (
        <View style={{flexDirection:'row'}}>
            {
                [...Array(5)].map((_, index) => {
                    return (
                        <TouchableOpacity activeOpacity={rate ?? 0.1 } onPress={() => handleRate(index + 1)} key={index}>
                            <Icon 
                                name={index < rateValue ? 'star' : 'star-outline'} 
                                size={24} 
                                color={color} 
                            />
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    );
};

export default Rate;