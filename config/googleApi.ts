import axios from "axios";

const URL = process.env.EXPO_PUBLIC_GOOGLE_API_URL

export const googleApi = axios.create({
    baseURL: URL,
    params:{
        components: 'country:ie',
        key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
    }
})