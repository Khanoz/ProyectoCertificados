<template>
  <div
    class="bg-secondary text-light p-3 flex justify-around items-center gap-2 relative w-fit max-w-[10rem] rounded-sm"
    @click="isUserOptionOpen = !isUserOptionOpen"
  >
    <div class="border-primary border-2 rounded-full">
      <!-- TODO: Ajustar una imagen acá o ícono -->
      <img
        :src="profileImg"
        v-if="userStore?.userInfo?.profileImage"
        alt="profileImage"
        class="rounded-full h-6 aspect-square"
      />
      <Icon class="w-auto h-6" icon="tabler:user-circle" v-else />
    </div>
    <span class="text-sm">{{ userStore.userInfo?.nickname }}</span>
    <div
      :class="{ 'arrow-down': !isUserOptionOpen, 'arrow-up': isUserOptionOpen }"
    ></div>
    <div
      v-if="isUserOptionOpen"
      class="bg-light rounded-bl-lg rounded-br-lg rounded-tl-lg w-[200%] md:w-[200%] h-fit absolute top-full right-0 text-dark text-start border-2 border-secondary p-1 font-bold"
    >
      <div class="block md:hidden border-b-2 border-secondary">
        <p><RouterLink
          :to="{ name: 'Search', query: { filter: 'userAdquired' } }"
          class="hover:bg-gray rounded m-2"
          >Mis boletos</RouterLink
        ></p>
        <p><RouterLink
          :to="{ name: 'Search', query: { filter: 'own' } }"
          class="hover:bg-gray rounded m-2"
          v-if="userStore.userInfo?.rol !== 'Usuario'"
          >Mis eventos</RouterLink
        ></p>
        <p><RouterLink
          :to="{ name: 'Search', query: { filter: 'nextDays' } }"
          class="hover:bg-gray rounded m-2"
          >Se acerca el día para...</RouterLink
        ></p>
        <p><RouterLink
          :to="{ name: 'Search', query: { filter: 'upcoming' } }"
          class="hover:bg-gray rounded m-2"
          >Próximos eventos</RouterLink
        ></p>
      </div>
      <div>
        <p class="hover:bg-gray rounded m-2">Administrar opciones de usuario</p>
        <p class="hover:bg-gray rounded m-2" @click="logout">Cerrar sesión</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import controlStateMixin from "@/mixins/ControlStateMixin";
import { Icon } from "@iconify/vue";

export default defineComponent({
  components: { Icon },
  mixins: [controlStateMixin],
  props: {
    userName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isUserOptionOpen: false,
    };
  },
  methods: {
    logout() {
      this.userStore.deleteUser();
      this.$router.push({ name: "Landing" });
    },
  },
  computed: {
    profileImg() {
      return `${import.meta.env.VITE_BACKEND_MEDIA_URL}/${
        this.userStore.userInfo.profileImage
      }`;
    },
  },
});
</script>
