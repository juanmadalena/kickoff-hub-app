import { useState, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

import { Text, useThemeColor } from '@/components/Themed';
import Icon from './Icon';
import BottomModal from './BottomModal';
import { Match, showOptions, orderOptions } from '@/interfaces';

type FiltersComponentProps = {
    order: keyof typeof orderOptions;
    groupBy: keyof Match;
    filter: keyof typeof showOptions;
    color: string;
    changeFilter: (filter: keyof typeof showOptions, group: keyof Match , order: keyof typeof orderOptions) => void;
}

const FiltersComponent = ( { order, groupBy, filter, color, changeFilter }: FiltersComponentProps ) => {

    const backgroundColor = useThemeColor({}, 'selectionBackground');
    const modalBackground = useThemeColor({}, 'itemBackground');

    const [ orderSelected, setOrderSelected ] = useState<keyof typeof orderOptions>(order);
    const [ groupBySelected, setGroupBySelected ] = useState<keyof Match>(groupBy);
    const [ filterSelected, setFilterSelected ] = useState<keyof typeof showOptions>(filter);

    const [ showFilters, setShowFilters ] = useState(false);

    const groupByAllowed = ['date', 'location'] as (keyof Match)[];
    
    const handleChangeFilter = () => {
        changeFilter( filterSelected, groupBySelected, orderSelected);
        setShowFilters(false);
    }

    return (
    <>
        <TouchableOpacity 
            onPress={() => setShowFilters(true)}
            activeOpacity={0.7}
            style={{ marginBottom: 12, marginHorizontal:14, height:50, borderRadius:14, backgroundColor: modalBackground, paddingHorizontal:8, alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
            <View style={{backgroundColor:'transparent', alignItems:'center', flexDirection:'row'}}>
                <View style={{minWidth:80, backgroundColor, paddingVertical:8, paddingHorizontal:20, borderRadius:12}}>
                    <Text style={{fontSize:14, fontWeight:'600', textAlign:'center'}}>
                        {showOptions[filter]}
                    </Text>
                </View>
                <View style={{minWidth:80, backgroundColor, paddingVertical:8, paddingHorizontal:20, borderRadius:12, marginLeft:8}}>
                    <Text style={{fontSize:14, fontWeight:'600', textAlign:'center'}}>
                        {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}
                    </Text>
                </View>
            </View>
            <View style={{backgroundColor, paddingVertical:8, paddingHorizontal:10, borderRadius:12, marginLeft:8}}>
                {
                    order === 'ASCENDING' ?
                    <Icon name='arrow-upward' size={18} />
                    :
                    <Icon name='arrow-downward' size={18} />
                }
            </View>
        </TouchableOpacity>
        {
            showFilters &&
            <BottomModal
                allowDragDownToClose={true}
                transparent
                modalBackground={modalBackground}
                modalHeight={340}
                visible={showFilters}
                setVisible={handleChangeFilter}
            >
                <View style={{paddingHorizontal:18, height:'100%'}}>
                    <View style={{justifyContent:'flex-end', alignItems:'center', flexDirection:'row', marginBottom:0}}>
                        <TouchableOpacity onPress={handleChangeFilter} style={{ padding:10, borderRadius:100, backgroundColor:`${color}AA`}}>
                            <Icon name='check' size={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={{justifyContent:'space-around', flex:1, paddingBottom:16}}>
                        <View>
                            {/* Show */}
                            <Text style={[styles.filterTitle]}>Show:</Text>
                            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                                {
                                    Object.keys(showOptions).map((key, index) => {
                                        return (
                                            <TouchableOpacity 
                                                activeOpacity={0.7}
                                                onPress={() => setFilterSelected(key as keyof typeof showOptions)}
                                                key={index} 
                                                style={[ styles.filterButton, 
                                                    {backgroundColor: key as keyof typeof showOptions== filterSelected ? `${color}66` : `${backgroundColor}44`}                                                
                                                ]}>
                                                <Text style={[styles.filterButtonText, {opacity: key as keyof typeof showOptions == filterSelected ? 1 : 0.5}]}>
                                                    {showOptions[key as keyof typeof showOptions]}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <View>
                            <Text style={[styles.filterTitle]}>Group by:</Text>
                            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                                {
                                    groupByAllowed.map((key, index) => {
                                        return (
                                            <TouchableOpacity 
                                                activeOpacity={0.7}
                                                onPress={() => setGroupBySelected(key)}
                                                key={index} 
                                                style={[ styles.filterButton, 
                                                    {backgroundColor: key == groupBySelected ? `${color}66` : `${backgroundColor}44`}                                                
                                                ]}>
                                                <Text style={[styles.filterButtonText, {opacity: key == groupBySelected ? 1 : 0.5}]}>
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <View>
                            <Text style={[styles.filterTitle]}>Order:</Text>
                            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                                {
                                    Object.keys(orderOptions).map((key, index) => {
                                        return (
                                            <TouchableOpacity 
                                                activeOpacity={0.7}
                                                onPress={() => setOrderSelected(key as keyof typeof orderOptions)}
                                                key={index} 
                                                style={[ styles.filterButton, 
                                                    {backgroundColor: key as keyof typeof orderOptions == orderSelected ? `${color}66` : `${backgroundColor}44`}                                                
                                                ]}>
                                                <Text style={[styles.filterButtonText, {opacity: key as keyof typeof orderOptions == orderSelected ? 1 : 0.5}]}>
                                                    {orderOptions[key as keyof typeof orderOptions]}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </BottomModal>
        }
    </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    filterTitle: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8
    },
    filterButton: {
        minWidth: 80,
        minHeight: 38,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 28,
        paddingVertical: 10,
        borderRadius: 12,
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center'
    }
});

export default FiltersComponent;