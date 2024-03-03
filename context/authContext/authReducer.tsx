import { ErrorResponse, Player } from "@/interfaces";

export interface AuthState {
    error: ErrorResponse | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    token: string | null;
    user: Player | null;
}

export type AuthAction =
    | { type: 'addError', payload: object}
    | { type: 'removeError' }
    | { type: 'login', payload: { token: string, user: Player } }
    | { type: 'register', payload: { token: string, user: Player } }
    | { type: 'notAuthenticated' }
    | { type: 'logout' }

export const authReducer = ( state: AuthState, action: AuthAction ): AuthState => {
    switch (action.type) {
        case 'logout':
        case 'notAuthenticated':
            return {
                ...state,
                status: 'not-authenticated',
                token: null,
                user: null
            }
        case 'login':
        case 'register':
            return {
                ...state,
                status: 'authenticated',
                token: action.payload.token,
                user: action.payload.user
            }
        case 'addError':
            return {
                ...state,
                status: 'not-authenticated',
                error: action.payload as ErrorResponse
            }
        case 'removeError':
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
};