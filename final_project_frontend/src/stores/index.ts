import { defineStore } from "pinia";
import type {IUser, IJWTToken} from '@/type';
import utils from "../utils";
import api from "../api";
import { AxiosResponse } from "axios";


export const useAppStore = defineStore('appStore', {
    state: () => ({
        overlayOpen: false as boolean,
        isLoading: false as boolean,
    }),
    actions: {
        openOverlay(){
            this.overlayOpen = true;
            utils.disableScroll()
        },
        closeOverlay(){
            this.overlayOpen = false;
            utils.enableScroll()
        },
        showSpinner(){
            this.isLoading = true;
            this.openOverlay()
        },
        closeSpinner(){
            this.isLoading = false;
            this.closeOverlay()
        },
        closeOnlySpinner(){
            this.isLoading = false;
        }
    }
});

export const useUserStore = defineStore('userStore', {
    state: () => ({
        authToken: null as IJWTToken,
        userInfo: null as IUser,
    }),
    actions: {
        setUser(rawToken: string ): IJWTToken {
            const token = utils.SetAuthToken(rawToken);
            this.authToken = token;
        },
        getUser(): IJWTToken | null{
            const token = utils.GetAuthObjectToken()
            if(!token) {
                this.deleteUser();
                return null;
            } else if (!this.authToken) {
                this.authToken = token;
            }
            return this.authToken;
        },
        deleteUser(){
            this.authToken = null;
            document.cookie = `${import.meta.env.VITE_AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        },
        async getOrUpdateUserInfo() {
            const response: AxiosResponse = await api.GetUserInfo();
            this.userInfo = response.data;
        },
    },
    getters: {
        isAuthenticated(state){
            return !!state.authToken
        }, 
    },
});