<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 rounded p-4">
        <EventComponent v-for="(v, i) in 9" :key="i" v-if="eventList!.length === 0"/>
        <EventComponent v-for="(v, i) in eventList" :key="i+i" :event="v" v-else />

    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import EventComponent from './EventComponent.vue';
import type { IEvent } from "../../api/types";


export default defineComponent({
    name: "EventResultsComponent",
    components: {EventComponent},
    props: {
        eventList: Object as PropType<IEvent[]>,
    },
});
</script>