import { useAppStore, useUserStore } from '@/stores';

export default {
    data() {
        return {
            appStore: useAppStore(),
            userStore: useUserStore(),
        };
    },
};