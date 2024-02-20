import { Match } from '@/interfaces';

export interface MatchesState {
    matches: Match[] | null,
    loading: boolean,
    selectedDate: string,
}

export type MatchesAction =
    | { type: 'setMatches', payload: Match[] }
    | { type: 'setLoading', payload: boolean }
    | { type: 'setSelectedDate', payload: string }
    | { type: 'findMatch', payload: string }
    | { type: 'cancelMatch', payload: string }
    | { type: 'resetState' }

export const matchesReducer = ( state: MatchesState, action: MatchesAction ): MatchesState => {

    switch (action.type) {
        case 'setMatches':
            return {
                ...state,
                matches: action.payload
            }
        case 'setLoading':
            return {
                ...state,
                loading: action.payload
            }
        case 'setSelectedDate':
            return {
                ...state,
                selectedDate: action.payload,
            }
        case 'resetState':
            return state;
        default:
            return state;
    }

}