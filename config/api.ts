import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const URL = process.env.EXPO_PUBLIC_API_URL

export const api = axios.create({
    // baseURL: URL
    baseURL: 'http://192.168.0.248:8020'
})

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if(token){
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
})