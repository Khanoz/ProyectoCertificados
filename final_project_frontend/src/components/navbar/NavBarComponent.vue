<template>
  <header v-if="$route.name !== 'UserSetup'" class="sticky top-0 z-50">
    <section
      class="w-full bg-primary text-center p-3 flex justify-between items-center gap-3 text-dark flex-col md:flex-row shadow-md"
    >
      <!-- Brand -->
      <div
        class="flex justify-around items-center w-full md:w-fit cursor-pointer"
        @click="$router.push('/')"
      >
        <div class="flex items-center">
          <h1 class="text-3xl mr-3">{{ brandName }}</h1>
          <div class="rounded-full h-8 w-8 bg-light"></div>
        </div>
        <NavBarUserComponent
          v-if="userStore.isAuthenticated"
          :user-name="user"
          class="md:hidden self-end"
        />
      </div>

      <form
        @submit.prevent="HandleSearch"
        v-if="userStore.isAuthenticated"
        class="flex items-center gap-1 px-3 py-2 bg-light rounded-full shadow-md md:w-1/2 w-full"
      >
        <input
          type="text"
          class="border-none w-full focus:ring-transparent focus:border-transparent"
          placeholder="¿Qué evento estás buscando?"
          v-model="searchParams"
        />
        <button type="submit">
          <Icon class="w-auto h-6" icon="tabler:search" />
        </button>
      </form>

      <!-- User -->
      <NavBarUserComponent
        v-if="userStore.isAuthenticated"
        :user-name="user"
        class="hidden md:flex"
      />
      <!-- No user navbar -->
      <div v-if="!userStore.isAuthenticated">
        <nav class="w-fit" v-if="$route.name !== 'Terms'">
          <ul
            class="list-none flex items-center gap-4 text-base cursor-pointer"
          >
            <li class="flex items-center gap-2">
              <RouterLink :to="{ name: 'Search' }">Próximos eventos</RouterLink>
              <Icon class="w-auto h-6" icon="tabler:calendar-event" />
            </li>
            <li class="flex items-center gap-2">
              <RouterLink :to="{ name: 'Search' }">Contacto</RouterLink>
              <Icon class="w-auto h-6" icon="tabler:info-circle" />
            </li>
            <li class="flex items-center gap-2" @click="OpenLoginModal">
              <LoginRegisterRecoverModalComponent v-if="appStore.overlayOpen" />
              <p>Ingresar</p>
              <Icon class="w-auto h-6" icon="tabler:login" />
            </li>
          </ul>
        </nav>
        <div v-else>
          <RouterLink :to="{ name: 'Landing' }" class="text-xl underline"
            >Regresar a página de inicio</RouterLink
          >
        </div>
      </div>
    </section>
    <!-- Sub navigation -->
    <section
      v-if="userStore.isAuthenticated"
      class="bg-secondary p-3 hidden md:block"
    >
      <ul class="flex gap-4 text-light underline text-sm">
        <li>
          <RouterLink
            :to="{ name: 'Search', query: { filter: 'userAdquired' } }"
            >Mis boletos</RouterLink
          >
        </li>
        <li v-if="userStore.userInfo?.rol !== 'Usuario'">
          <RouterLink :to="{ name: 'Search', query: { filter: 'own' } }"
            >Mis eventos</RouterLink
          >
        </li>
        <li>
          <RouterLink :to="{ name: 'Search', query: { filter: 'nextDays' } }"
            >Se acerca el día para...</RouterLink
          >
        </li>
        <li>
          <RouterLink :to="{ name: 'Search', query: { filter: 'upcoming' } }"
            >Próximos eventos</RouterLink
          >
        </li>
      </ul>
    </section>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBarUserComponent from "./NavBarUser.vue";
import LoginRegisterRecoverModalComponent from "@/components/modals/LoginRegisterRecoverModalComponent.vue";
import { Icon } from "@iconify/vue";
import controlStateMixin from "../../mixins/ControlStateMixin";

export default defineComponent({
  name: "NavBarComponent",
  mixins: [controlStateMixin],
  components: { NavBarUserComponent, Icon, LoginRegisterRecoverModalComponent },
  props: {
    brandName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      searchParams: "",
      user: "alejandro",
      isUserOptionOpen: false,
      isLoginModalOpen: false,
    };
  },
  methods: {
    HandleSearch() {
      this.$router.push({
        name: "Search",
        query: { filter: "search", q: this.$data.searchParams },
      });
    },
    OpenLoginModal() {
      this.appStore.openOverlay();
      this.isLoginModalOpen = !this.isLoginModalOpen;
    },
  },
});
</script>

<style lang="scss">
@layer navbar {
  nav > ul > li {
    @apply relative p-1;

    &::after {
      content: "";
      @apply absolute h-[2px] w-0 bottom-0 left-0 bg-dark;
      transition: 0.2s;
    }

    &:hover::after {
      @apply w-full;
    }
  }
}
</style>
