<template>
  <!-- Overlay -->
  <aside
    class="w-full h-full z-[100] grid place-items-center p-4 fixed"
    v-if="appStore.overlayOpen"
  >
    <!-- Zona gris -->
    <div class="absolute top-0 left-0 w-full h-full bg-faded_gray -z-10"></div>

    <!-- Loader -->
    <div v-if="appStore.isLoading" class="grid place-items-center">
      <p class="text-3xl text-dark">Por favor espere...</p>
      <LoaderComponent />
    </div>
    <!-- Zona de elementos -->
    <div id="overlay" v-show="!appStore.isLoading"></div>
  </aside>

  <NavBarComponent :brandName="getAppName" />
  <router-view />
  <!-- Contacto -->
  <section
    class="bg-primary flex flex-col md:flex-row justify-between items-center gap-4 text-dark"
    id="contact"
  >
    <div class="flex flex-col">
      <a href="mailto:example@example.com"
        ><b>Correo:</b> example@example.com</a
      >
      <a href="tel:+"><b>Teléfono:</b>xxx-xxxxxxx</a>
    </div>
    <button
      class="border-2 border-secondary px-4 py-2 rounded text-sm md:text-lg w-fit hover:bg-secondary hover:text-light"
      @click="$router.push({ name: 'Terms' })"
    >
      Leer términos y condiciones
    </button>
  </section>
  <footer class="text-center bg-dark p-4 text-light">
    <small>{{ getAppName }} @ 2023. Derechos Reservados</small>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoaderComponent from "@/components/generic/LoaderComponent.vue";
import NavBarComponent from "./components/navbar/NavBarComponent.vue";
import controlStateMixin from "@/mixins/controlStateMixin.ts";

export default defineComponent({
  components: { NavBarComponent, LoaderComponent },
  mixins: [controlStateMixin],
  mounted() {
    // TODO: Verifica que el usuario exista en las cookies o localstorage y lo mete al state manager (Pinia)
    this.userStore.getUser();
  },
  computed: {
    getAppName() {
      return import.meta.env.VITE_APP_NAME;
    },
  },
  methods: {},
});
</script>
