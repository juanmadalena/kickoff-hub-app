import { createContext, useEffect, useReducer, useState } from "react";
import * as SecureStore from 'expo-secure-store';

import { api } from "@/api/api";
import { AuthState, authReducer } from "./authReducer";
import { LoginData, LoginResponse, RegisterData, User } from "@/interfaces/interfaces";

interface AuthContextType {
    error: object | null,
    token: string | null,
    user: User | null,
    status: 'checking' | 'authenticated' | 'not-authenticated',
    register: (userData: any) => void,
    login: (data: LoginData) => void,
    logout: () => void,
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
            console.error(err);
            
            dispatch({ type: 'notAuthenticated' });
            SecureStore.deleteItemAsync('token');
        }
    }

    const register = async ({ username, email, firstName, lastName, password, position }: RegisterData) => {
        try{
            const { data } = await api.post<LoginResponse>('/auth/register', { username, email, firstName, lastName, password, position });

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
            dispatch({
                type: 'addError',
                payload: err.response.data || 'Información incorrecta'
            })
        }
    }
    const login = async ({ username, password }: LoginData) => {
        try{
            const { data } = await api.post<LoginResponse>('/auth/login', { username, password });

            dispatch({
                type: 'login',
                payload: {
                    token: data.token,
                    user: data.user,
                }
            })

            SecureStore.setItemAsync('token', data.token);

        }
        catch(err: any){
            console.log(err);
            dispatch({
                type: 'addError',
                payload: err || 'Información incorrecta'
            })
        }
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
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}