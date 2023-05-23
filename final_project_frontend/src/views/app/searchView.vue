<template>
  <section>
    <EventResultsComponent :eventList="data" />
  </section>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import EventResultsComponent from "@/components/generic/EventResultsComponent.vue";
import api from "@/api";
import controlStateMixin from "@/mixins/controlStateMixin.ts";
import { IEvent } from "@/types";

export default defineComponent({
  mixins: [controlStateMixin],
  components: { EventResultsComponent },
  data() {
    return {
      filter: "",
      data: [] as IEvent[],
    };
  },
  mounted() {
    this.data = [];
    this.filter = this.$route.query.filter;
    this.loadData();
  },
  beforeRouteUpdate(to) {
    this.data = [];
    this.filter = to.query.filter;
    this.loadData();
  },
  methods: {
    loadData() {
      this.appStore.showSpinner();
      switch (this.filter) {
        case "nextDays":
          this.loadUpcomingEvents();
          break;
        case "upcoming":
          this.loadNextDayEvents();
          break;
        case "userAdquired":
          this.loadUserAdquiredEvents();
          break;
        case "own":
          break;
        default:
          this.loadUserSearchEvent();
          break;
      }
    },
    loadNextDayEvents() {
      api
        .GetCloseDateEvents()
        .then((response: Object) => {
          const { data } = response;
          data.forEach((e) => {
            this.data.push({
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
          this.appStore.closeSpinner();
        });
    },
    loadUpcomingEvents() {
      api
        .GetNextEvents()
        .then((response: Object) => {
          const { data } = response;
          data.forEach((e) => {
            this.data.push({
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
          this.appStore.closeSpinner();
        });
    },
    loadUserAdquiredEvents() {
      api
        .GetUserEvents()
        .then((response: Object) => {
          const { data } = response;
          data.forEach((e) => {
            this.data.push({
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
          this.appStore.closeSpinner();
        });
    },
    loadUserSearchEvent() {
      api
        .GetEventByName(this.$route.query.q || "")
        .then((response: Object) => {
          const { data } = response;
          console.log(data);

          data.forEach((e) => {
            this.data.push({
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
          this.appStore.closeSpinner();
        });
    },
  },
});
</script>
