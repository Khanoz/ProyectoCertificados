<template>
  <section>
    <form @submit.prevent="sendForm" class="form m-auto xs:w-2/3 md:w-1/3">
      <h2 class="text-3xl">Información de usuario:</h2>
      <p class="pb-2">
        Necesitaremos un poco más de información sobre usted para poder
        configurar su cuenta de usuario
      </p>

      <!-- Carga de imagen -->
      <div
        class="flex flex-wrap md:flex-nowrap gap-2 justify-center items-center"
      >
        <img
          :src="imgSrc || 'img/no_user.webp'"
          alt="foto"
          class="rounded-full border-2 border-primary h-40 w-40"
        />
        <FileUploaderComponent
          :title="'Carga tu imagen de perfil'"
          :isImage="true"
          :maxFiles="1"
          :extensions="['png', 'jpeg', 'jpg']"
          v-model="image"
        />
      </div>

      <span>
        <label for="formNames">Nombre(s)</label>
        <input
          id="formNames"
          type="text"
          v-model="names"
          placeholder="Ingresa tu(s) nombre(s) aquí..."
          required
        />
      </span>
      <span>
        <label for="formLastNames">Apellido(s)</label>
        <input
          id="formLastNames"
          type="text"
          v-model="lastNames"
          placeholder="Ingresa tu(s) apellido(s) aquí..."
          required
        />
      </span>
      <span>
        <label for="formNames"
          >¿Cómo le gustaría que le llamemos en Eventus?</label
        >
        <input
          id="formNames"
          type="text"
          v-model="nickname"
          placeholder="Ingresa tu nickname aquí..."
          required
        />
      </span>
      <span>
        <label for="formBirthDate">Fecha de Nacimiento</label>
        <input
          id="formBirthDate"
          type="date"
          v-model="birthday"
          placeholder="Ingresa tu fecha de nacimiento..."
          required
        />
      </span>
      <span>
        <label>¿Es host de eventos?</label>
        <DropdownComponent
          question="Seleccione el rol de su usuario"
          :options="Object.keys(rolOptions)"
          v-model="rol"
        />
      </span>
      <ErrorMessageComponent v-if="error"/>
      <button type="submit" class="button">Terminar registro</button>
    </form>
  </section>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import DropdownComponent from "@/components/generic/DropdownComponent.vue";
import FileUploaderComponent from "@/components/generic/FileUploaderComponent.vue";
import ErrorMessageComponent from "@/components/generic/ErrorMessageComponent.vue";
import controlStateMixin from "@/mixins/controlStateMixin.ts";
import api from "@/api";
import { Icon } from "@iconify/vue";

export default defineComponent({
  components: { DropdownComponent, Icon, FileUploaderComponent, ErrorMessageComponent },
  mixins: [controlStateMixin],
  mounted() {
    this.appStore.showSpinner();
    api
      .GetUserRols()
      .then((response: Object) => (this.rolOptions = response.data))
      .catch(() => this.error = true)
      .finally(() => this.appStore.closeSpinner());
  },
  data() {
    return {
      names: "",
      lastNames: "",
      nickname: "",
      birthday: "",
      rol: "",
      rolOptions: {},
      image: [],
      imgSrc: "",
      error: false,
    };
  },
  watch:{
    image(newImage: File[]){
      if(!newImage){
        this.updateProfileImage("");
      } else {
        this.updateProfileImage(URL.createObjectURL(newImage[0]));
      }
    },
  },
  methods: {
    sendForm() {
      this.appStore.showSpinner();
      const formData = {
        names: this.names,
        lastNames: this.lastNames,
        nickname: this.nickname,
        birthday: new Date(this.birthday),
        rol: this.rol,
        image: this.image[0] ?? null
      };
      api.UpsertUserInfo(formData)
      .then(() => this.$router.push({name: 'App'}))
      .catch((e: Object) => this.error = true)
      .finally(() => this.appStore.closeSpinner());
    },
    updateProfileImage(src: string){
      this.imgSrc = src;
    }
  },
});
</script>
