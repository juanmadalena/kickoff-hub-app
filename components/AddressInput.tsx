import { useEffect, useRef, useState } from 'react';
import { FlatList, View, TouchableOpacity, TextInput as DefaultTextInput, StyleSheet } from 'react-native';

import { Text, useThemeColor } from '@/components/Themed';
import { TextInput } from '@/components/Themed';
import useDebouncer from '@/hooks/useDebouncer';
import { useLocationAutocomplete } from '@/hooks/useLocationAutocomplete';

interface AddressInputProps {
    editable?: boolean;
    value: string;
    onChangeAddress: (location: string, address:string, id: string) => void;
}

const AddressInput = ( { value, editable = true, onChangeAddress }: AddressInputProps ) => {

    const [ location, setLocation ] = useState<string>(value);
    
    const [ showSuggestions, setShowSuggestions ] = useState(false)
    
    const inputRef = useRef<DefaultTextInput | null>(null);

    const backgroundColor = useThemeColor({}, 'itemBackground');

    useEffect(() => {
        setLocation(value);
    }, [value])

    const { debouncedValue } = useDebouncer( location, 600 )

    const { autocompleteQuery: data } = useLocationAutocomplete({ query: debouncedValue });

    const handleSelection = (location: string, address: string, id:string) => {
        inputRef.current?.blur();
        setLocation(`${location}, ${address}`);
        setShowSuggestions(false);
        onChangeAddress(location, address, id);
    }

    return (
        <View style={[styles.container]}>
            <TextInput
                innerRef={inputRef}
                value={ location }
                style={{ opacity: editable ? 1 : 0.4 }}
                onChangeText={(value) => setLocation(value)}
                placeholder="Location*"
                selectTextOnFocus
                onFocus={() => setShowSuggestions(true)}
                editable={editable}
            />
            {
                showSuggestions && data.data?.predictions && data.data?.predictions.length > 0 && editable &&
                (
                    <FlatList 
                    data={data.data?.predictions || []}
                    style={[styles.listContainer, {backgroundColor}]}
                    keyboardShouldPersistTaps="always"
                    ListEmptyComponent={() => null}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity 
                                activeOpacity={0.8}
                                style={[styles.suggestionButton]}
                                onPress={
                                    () => 
                                    handleSelection(item.structured_formatting.main_text, item.structured_formatting.secondary_text, item.place_id)
                                }>
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
