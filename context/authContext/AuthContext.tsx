import { createContext, useEffect, useReducer } from "react";
import * as SecureStore from 'expo-secure-store';

import { api } from "@/config/api";
import { AuthState, authReducer } from "./authReducer";
import { ErrorResponse, LoginData, LoginResponse, Player, RegisterData } from "@/interfaces";

interface AuthContextType {
    error: ErrorResponse | null,
    token: string | null,
    user: Player | null,
    status: 'checking' | 'authenticated' | 'not-authenticated',
    register: (userData: any) => void,
    login: (data: LoginData) => void,
    logout: () => void,
    removeError: () => void,
    checkToken: () => void,
} 

const initialState: AuthState = {
    error: null,
    token: null,
    user: null,
    status: 'checking',
}

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }:any) => {

    const [ state, dispatch ] = useReducer( authReducer, initialState )

    useEffect(() => {
        checkToken();
    }, [])

    const checkToken = async () => {
        const token = await SecureStore.getItemAsync('token');

        if(!token) return dispatch({ type: 'notAuthenticated' });

        try{
            const { data } = await api.get('/auth/validateToken');
            dispatch({
                type: 'login',
                payload: {
                    token: data.token,
                    user: data.user
                }
            })
            
            SecureStore.setItemAsync('token', data.token);
        }
        catch(err){
            
            dispatch({ type: 'notAuthenticated' });
            SecureStore.deleteItemAsync('token');
        }
    }

    const register = async ({ email, firstName, lastName, password, position }: RegisterData) => {
        try{
            const { data } = await api.post<LoginResponse>('/auth/register', { email, firstName, lastName, password, position });

            dispatch({
                type: 'register',
                payload: {
                    token: data.token,
                    user: data.user
                }
            })

            SecureStore.setItemAsync('token', data.token);
        }
        catch(err: any){
            if(err.isAxiosError){
                return dispatch({
                    type: 'addError',
                    payload: err.response.data
                })
            }
            dispatch({
                type: 'addError',
                payload: {message: 'Something went wrong. Please try again.'}
            })
        }
    }
    const login = async ({ email, password }: LoginData) => {
        try{

            const { data } = await api.post<LoginResponse>('/auth/login', { email, password });

            SecureStore.setItemAsync('token', data.token);
            
            return dispatch({
                type: 'login',
                payload: {
                    token: data.token,
                    user: data.user,
                }
            })
            
        }
        catch(err: any){
            if(err.isAxiosError){
                return dispatch({
                    type: 'addError',
                    payload: err.response.data
                })
            }
            dispatch({
                type: 'addError',
                payload: {message: 'Something went wrong. Please try again.'}
            })
        }
    }

    const removeError = () => {
        dispatch({ type: 'removeError' });
    }

    const logout = () => {
        SecureStore.deleteItemAsync('token');
        dispatch({ type: 'logout' });
    }


    return (
        <AuthContext.Provider value={{
            ...state,
            register,
            login,
            logout,
            removeError,
            checkToken,
        }}>
            {children}
        </AuthContext.Provider>
    )
}