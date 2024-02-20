import { createContext, useContext, useEffect, useReducer } from "react";
import { Match } from "@/interfaces";
import { matchesReducer, MatchesState } from "./matchesReducer";
import { formatDateToString } from "@/utils/formatDateToString";
import { api } from '@/config/api';
import { AuthContext } from "../authContext/AuthContext";

interface MatchesContextType {
    matches: Match[] | null,
    loading: boolean,
    selectedDate: string,
    setSelectedDate: (date: string) => void,
    fetchMatches: (date: string) => void,
    resetMatches: () => void
}

export const initialState: MatchesState = {
    matches: null,
    loading: true,
    selectedDate: formatDateToString(new Date())
}

export const MatchesContext = createContext({} as MatchesContextType);

export const MatchesProvider = ({ children }: any) => {

    const { status }= useContext( AuthContext );

    const [ state, dispatch ] = useReducer( matchesReducer, initialState );

    const fetchMatches = async (date: string) => {
        console.log('fetching matches', date)
        dispatch({ type: 'setLoading', payload: true });
        try{
            const {data: { matches }} = await api.get(`/matches?date=${date}`)
            dispatch({ type: 'setMatches', payload: matches });
        }
        catch(err){
            console.log("error", err);
            dispatch({ type: 'setMatches', payload: [] });
        }
        finally{
            dispatch({ type: 'setLoading', payload: false });
        }
    }

    useEffect(() => {
        if( status === 'authenticated'){
            console.log('fetching matches en useEffect', state.selectedDate)
        }
        // fetchMatches(state.selectedDate);
    }, [])

    useEffect(() => {
        if( status === 'authenticated'){
            fetchMatches(state.selectedDate);
        }
    }, [state.selectedDate]);

    const setSelectedDate = async (date: string) => {
        dispatch({ type: 'setSelectedDate', payload: date });
    }      

    const resetMatches = () => {
        dispatch({ type: 'resetState' });
    }

    return (
        <MatchesContext.Provider value={{
            ...state,
            setSelectedDate,
            fetchMatches,
            resetMatches
        }}>
            { children }
        </MatchesContext.Provider>
    )
}