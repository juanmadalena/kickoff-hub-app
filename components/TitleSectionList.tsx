import { Text, View } from '@/components/Themed';
import { formatDateToString } from '@/utils/formatDateToString';
import { memo } from 'react';

type TitleSectionListProps = {
    title: string | number;
};

const TitleSectionList = memo(function TitleSectionList({ title }: TitleSectionListProps){

    const titleFormatted = typeof title === 'number' ? formatDateToString(new Date(title), 'dd/mm/yyyy') : title;

    return (
        <View style={{padding:10, width:'100%'}}>
            <Text style={{fontSize:14, fontWeight:'500'}} >{titleFormatted}</Text>
        </View>
    );
});

export default TitleSectionList;