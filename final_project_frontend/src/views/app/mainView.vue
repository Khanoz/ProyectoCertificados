<template>
  <section>
    <h2 class="text-center text-3xl mb-4 text-light font-bold">
      Se acerca el día para...
    </h2>
    <EventResultsComponent :eventList="closeDatesEvents" />
  </section>
  <section>
    <h2 class="text-center text-3xl mb-4 text-light font-bold">
      Próximos eventos:
    </h2>
    <EventResultsComponent :eventList="nextEvents" />
  </section>
  <section class="pt-0">
    <button
      class="block p-2 m-auto border-2 border-primary rounded-full text-primary hover:bg-primary hover:text-dark shadow"
      @click="$router.push({ name: 'Search', query: { filter: 'userAdquired' } })"
    >
      Consulta tus boletos adquiridos
    </button>
  </section>
  <button
    v-if="userStore.userInfo?.rol !== 'Usuario'"
    @click="$router.push({name: 'Search', query:{filter: 'userAdquired'}})"
    class="p-4 rounded-full fixed bottom-4 right-4 bg-primary border-2 border-transparent hover:border-secondary text-light hover:text-secondary shadow-sm shadow-gray text-6xl font aspect-square flex items-center justify-center"
  >
    +
  </button>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import EventResultsComponent from "@/components/generic/EventResultsComponent.vue";
import api from "@/api";
import controlStateMixin from "@/mixins/controlStateMixin.ts";
import { IEvent } from "@/types";

export default defineComponent({
  name: "mainView",
  mixins: [controlStateMixin],
  components: { EventResultsComponent },
  data() {
    return {
      nextEvents: [] as IEvent[],
      closeDatesEvents: [] as IEvent,
    };
  },
  mounted() {
    let didLoad = false;
    this.appStore.showSpinner();

    api
      .GetNextEvents()
      .then((response: Object) => {
        const { data } = response;
        data.forEach((e) => {
          this.nextEvents.push({
            eventName: e.name,
            eventPlace: e.place,
            eventImage: e.images,
            eventDate: new Date(e.date),
            eventCapacity: e.capacity,
            eventDescription: e.description,
          });
        });
      })
      .finally(() => {
        if (!didLoad) {
          didLoad = true;
        } else {
          this.appStore.closeSpinner();
        }
      });

    api
      .GetCloseDateEvents()
      .then((response: Object) => {
        const { data } = response;
        data.forEach((e) => {
          this.closeDatesEvents.push({
            eventName: e.name,
            eventPlace: e.place,
            eventImage: e.images,
            eventDate: new Date(e.date),
            eventCapacity: e.capacity,
            eventDescription: e.description,
          });
        });
      })
      .finally(() => {
        if (!didLoad) {
          didLoad = true;
        } else {
          this.appStore.closeSpinner();
        }
      });
  },
});
</script>
