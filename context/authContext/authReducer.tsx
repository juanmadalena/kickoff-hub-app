import { User } from "@/interfaces/interfaces";

export interface AuthState {
    error: object | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    token: string | null;
    user: User | null;
}

export type AuthAction =
    | { type: 'addError', payload: object}
    | { type: 'login', payload: { token: string, user: User } }
    | { type: 'register', payload: { token: string, user: User } }
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
                error: action.payload
            }
        default:
            return state;
    }
};