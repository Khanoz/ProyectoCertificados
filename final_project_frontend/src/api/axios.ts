import axios, { AxiosInstance } from 'axios';
import utils from "@/utils";
import { loadIcon } from '@iconify/vue';

export default function CreateAxiosInstance(): AxiosInstance {
    const headers: {Authorization?: string} = {}

    // NOTE: Comprueba que el token de autenticación está en las cookies
    const authToken = utils.GetAuthToken();
    if(authToken){
        headers.Authorization = `Bearer ${authToken}`;
    }
    return axios.create({
        baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
        timeout: parseInt(import.meta.env.VITE_AXIOS_REQUEST_TIMEOUT),
        headers,
    });
} 
  