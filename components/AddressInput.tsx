import { useMemo, useRef, useState } from 'react';
import { FlatList, View, TouchableOpacity, TextInput as DefaultTextInput, StyleSheet } from 'react-native';

import { Text, useThemeColor } from '@/components/Themed';
import { TextInput } from '@/components/Themed';
import useDebouncer from '@/hooks/useDebouncer';
import { useForm } from '@/hooks/useForm';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface AddressInputProps {
    onChangeAddress: (location: string) => void;
}

const AddressInput = ( { onChangeAddress }: AddressInputProps ) => {

    const [ location, setLocation ] = useState<string>();
    const [ showSuggestions, setShowSuggestions ] = useState(false)

    const inputRef = useRef<DefaultTextInput | null>(null);

    const backgroundColor = useThemeColor({}, 'itemBackground');

    const { debouncedValue } = useDebouncer( location, 1000 )

    const suggestions = useMemo( () => {
        if(debouncedValue.trim() === '') return [];
        if(!showSuggestions) return [];

        const prediction = axios.get<AutocompleteResponse>(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${debouncedValue}&components=country:ie&key=AIzaSyBLA5y_dJmk_Bg6qdSdtxKNetNrQDgmOTY`)
        .then( ({data}) => {
            return data.predictions;
        })

        return prediction;

    }, [debouncedValue])

    const { data = [] } = useQuery({
        queryKey: ['suggestions', suggestions],
        queryFn: () => suggestions,
        enabled: debouncedValue.trim() !== '' && showSuggestions
    });

    const handleSelection = (value: string) => {
        inputRef.current?.blur();
        setLocation(value);
        setShowSuggestions(false);
        onChangeAddress(value);
    }

    return (
        <View style={[styles.container]}>
            <TextInput
                innerRef={inputRef}
                value={ location }
                onChangeText={(value) => setLocation(value)}
                placeholder="Location*"
                selectTextOnFocus
                onFocus={() => setShowSuggestions(true)}
            />
            {
                showSuggestions && data.length > 0 &&
                (
                    <FlatList 
                    data={data}
                    style={[styles.listContainer, {backgroundColor}]}
                    keyboardShouldPersistTaps="always"
                    ListEmptyComponent={() => null}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity 
                                activeOpacity={0.8}
                                style={[styles.suggestionButton]}
                                onPress={() => handleSelection(`${item.structured_formatting.main_text} - ${item.structured_formatting.secondary_text}`)}>
                                <Text style={[styles.suggestionMainText]}>{item.structured_formatting.main_text}</Text>
                                <Text style={[styles.suggestionSecondaryText]}>{item.structured_formatting.secondary_text}</Text>
                            </TouchableOpacity>
                        )
                    }}
                    />
                )
            }
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        width:'100%', 
        zIndex:100
    },
    listContainer: { 
        zIndex:9999, 
        position:'absolute', 
        maxHeight:'80%', 
        top:64, 
        width:'100%', 
        borderBottomRightRadius:6, 
        borderBottomLeftRadius:6, 
        paddingTop:4, 
        paddingBottom:16, 
        paddingHorizontal:8
    },
    suggestionButton: {
        height:60, 
        paddingVertical:8, 
        borderBottomColor:'rgba(0,0,0,0.3)', 
        borderBottomWidth:1
    },
    suggestionMainText: {
        fontSize:15
    },
    suggestionSecondaryText: {
        fontSize:13, 
        opacity:0.5
    }

});

export default AddressInput;


export interface AutocompleteResponse {
    predictions: Prediction[];
    status:      string;
}

export interface Prediction {
    description:           string;
    matched_substrings:    MatchedSubstring[];
    place_id:              string;
    reference:             string;
    structured_formatting: StructuredFormatting;
    terms:                 Term[];
    types:                 string[];
}

export interface MatchedSubstring {
    length: number;
    offset: number;
}

export interface StructuredFormatting {
    main_text:                    string;
    main_text_matched_substrings: MatchedSubstring[];
    secondary_text:               string;
}

export interface Term {
    offset: number;
    value:  string;
}
