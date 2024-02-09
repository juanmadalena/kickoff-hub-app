import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const URL = 'https://kickoff-hub-backend-dev-tjnt.2.ie-1.fl0.io';

export const api = axios.create({
    baseURL: URL
})

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if(token){
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
})

// api.interceptors.response.use(async (resp) => {
//     return resp;
// }, async (error) => {
//     if(error.response.status === 401){
//         console.log("unauthorized");
//         SecureStore.deleteItemAsync('token');
//     }
//     return Promise.reject(error);
// })