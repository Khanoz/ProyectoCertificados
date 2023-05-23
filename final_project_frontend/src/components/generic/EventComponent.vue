<template>
    <div class="h-24 sm:rounded-lg overflow-hidden flex">
            <ContentLoader :animate="true" :speed="2" :primary-opacity=".1" :secondary-opacity=".1" class="w-full" v-if="!event"/> 
            <img :src="eventImage" alt="/img/landing_hero.jpg" class="max-w-[33.33%] border-light sm:border-none border-b-2" v-if="event"/>
            <div class="w-full px-3 py-1 text-light flex flex-col justify-between border-light sm:border-none border-b-2" v-if="event">
                <div>
                    <p class="font-bold text-sm sm:text-base">{{ event!.eventName }}</p>
                    <p class=" text-sm sm:text-base">{{event!.eventPlace}}</p>
                </div>
                <small class="text-xs sm:text-sm text-gray md:underline">{{ event!.eventDate.toDateString()}}</small>
            </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ContentLoader } from 'vue-content-loader';
import type { IEvent } from "../../api/types";

export default defineComponent({
    components: { ContentLoader },
    props: {
        event: Object as PropType<IEvent>,
    },
    computed: {
        eventImage() {
            let img: String;
            try {
                img =  import.meta.env.VITE_BACKEND_MEDIA_URL + "/" + this.event!.eventImage[0]
            } catch (error) {
                console.log(error);
                
                img = "/img/landing_hero.jpg"
            }
            return img;
        }
    }
});
</script>