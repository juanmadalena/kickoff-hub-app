import { useQuery } from "@tanstack/react-query";
import { googleApi } from "@/config/googleApi";
import { AutocompleteResponse } from "@/components/AddressInput";
import { useMemo } from "react";

type useLocationAutocompleteProps = {
    query: string;
}

export const useLocationAutocomplete = ({ query }: useLocationAutocompleteProps) => {

    const getAutocomplete = useMemo( async () => {
        const { data } = await googleApi.get<AutocompleteResponse>(`/place/autocomplete/json?input=${query}`);
        return data;
    }, [query]);

    const autocompleteQuery = useQuery({
        queryKey: ['autocomplete', query],
        queryFn: () => getAutocomplete,
        enabled: query.trim() !== '',
    });

    return {
        autocompleteQuery
    }
}