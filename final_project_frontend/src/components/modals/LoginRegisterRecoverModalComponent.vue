<template>
  <ModalComponent>
    <template #title v-if="componentView === 'login'"
      >¡Bienvenido otra vez!</template
    >
    <template #title v-if="componentView === 'register'"
      >Registro de usuario</template
    >
    <template #title v-if="componentView === 'recover'"
      >¿Olvidaste tu contraseña?</template
    >

    <template #description v-if="componentView === 'register'"
      >Para completar el registro de su cuenta en la plataforma, necesitaremos
      que nos provea con la siguiente información</template
    >
    <template #description v-if="componentView === 'recover'"
      >Le vamos a enviar un email a la dirección indicada donde se le indicará
      los pasos a seguir para reestrablecer su contraseña</template
    >

    <template #body v-if="componentView === 'login'">
      <form
        @submit.prevent="sendLoginForm"
        class="form"
      >
        <span>
          <label for="loginFormEmail">Correo</label>
          <input
            id="loginFormEmail"
            type="email"
            v-model="loginEmailForm"
            placeholder="Ingresa tu email aquí..."
            required
          />
        </span>
        <span>
          <label for="loginFormPassword">Contraseña</label>
          <input
            id="loginFormPassword"
            type="password"
            v-model="loginPasswordForm"
            placeholder="Ingresa tu contraseña aquí..."
            required
          />
        </span>
        <button type="submit" class="button">Ingresar</button>
        <div v-if="loginError" class="p-2 bg-red text-light">
          {{ loginError }}
        </div>
      </form>
      <div class="flex items-center justify-around">
        <p
          class="text-sm md:text-base underline"
          @click="componentView = 'recover'"
        >
          ¿Olvidaste tu contraseña?
        </p>
        <p
          class="text-sm md:text-base underline"
          @click="componentView = 'register'"
        >
          ¿No tienen cuenta aún?
        </p>
      </div>
    </template>

    <template #body v-if="componentView === 'register'">
      <form
        @submit.prevent="sendRegisterForm"
        class="form"
      >
        <span>
          <label for="registerEmailForm">Correo</label>
          <input
            id="registerEmailForm"
            type="email"
            v-model="registerEmailForm"
            placeholder="Ingresa tu email aquí..."
            required
          />
        </span>
        <span>
          <label for="registerPasswordForm">Contraseña</label>
          <input
            id="registerPasswordForm"
            type="password"
            v-model="registerPasswordForm"
            placeholder="Ingresa tu contraseña aquí..."
            required
          />
        </span>
        <span>
          <label for="registerRepeatPasswordForm">Confirme su contraseña</label>
          <input
            id="registerRepeatPasswordForm"
            type="password"
            v-model="registerRepeatPasswordForm"
            placeholder="Repite tu contraseña aquí..."
            required
          />
        </span>
        <button type="submit" class="button">Registrar</button>
        <div v-if="registerError" class="p-2 bg-red text-light">
          {{ registerError }}
        </div>
      </form>
      <div class="flex items-center justify-around">
        <p
          class="text-sm md:text-base underline"
          @click="componentView = 'recover'"
        >
          ¿Olvidaste tu contraseña?
        </p>
        <p
          class="text-sm md:text-base underline"
          @click="componentView = 'login'"
        >
          ¿Ya tienes una cuenta?
        </p>
      </div>
    </template>

    <template #body v-if="componentView === 'recover'">
      <form
        @submit.prevent="sendRecoverForm"
        class="form"
      >
        <span>
          <label for="recoverEmailForm">Correo</label>
          <input
            id="recoverEmailForm"
            type="email"
            v-model="recoverEmailForm"
            placeholder="Ingresa tu email para recuperación aquí..."
            required
          />
        </span>
        <button type="submit" class="button">Recuperar</button>
      </form>
      <div class="flex items-center justify-around">
        <p
          class="text-sm md:text-base underline"
          @click="componentView = 'login'"
        >
          ¿Ya tienes una cuenta?
        </p>
        <p
          class="text-sm md:text-base underline"
          @click="componentView = 'register'"
        >
          ¿No tienen cuenta aún?
        </p>
      </div>
    </template>
  </ModalComponent>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import authApi from "@/api/auth";
import controlStateMixin from "@/mixins/controlStateMixin.ts";
import ModalComponent from "@/components/generic/ModalComponent.vue";

type ComponentView = "login" | "register" | "recover";

export default defineComponent({
  name: "LoginRegisterRecoverModalComponent",
  mixins: [controlStateMixin],
  components: { ModalComponent },
  data() {
    return {
      loginEmailForm: "" as string,
      loginPasswordForm: "" as string,
      loginError: "" as string,
      registerEmailForm: "" as string,
      registerPasswordForm: "" as string,
      registerRepeatPasswordForm: "" as string,
      registerError: "" as string,
      recoverEmailForm: "" as string,
      recoverError: "" as string,
      componentView: "login" as ComponentView,
    };
  },
  beforeMount() {
    this.loginEmailForm, (this.loginPasswordForm = ""), "";
  },
  methods: {
    sendLoginForm() {
      this.appStore.showSpinner();
      authApi
        .Login(this.loginEmailForm, this.loginPasswordForm)
        .then((response: Object) => {
          this.userStore.setUser(response.data.token);
          this.$router.push({ name: "App" });
        })
        .catch((err: Object) => {
          this.loginError = "Usuario o contraseña incorrectos";
        })
        .finally(() => this.appStore.closeSpinner());
    },
    sendRegisterForm() {
      if (this.registerPasswordForm !== this.registerRepeatPasswordForm){
        this.registerError = "Los campos de contraseña deben coincidir";
        return;
      }
      this.appStore.showSpinner();
      authApi
        .Register(this.registerEmailForm, this.registerPasswordForm)
        .then((response: Object) => {
          console.log(response);
          
          this.userStore.setUser(response.data.token);
          this.$router.push({ name: "UserSetup" });
        })
        .catch((err: Object) => {
          this.registerError = `Ya existe un usuario registrado con el correo ${this.registerEmailForm}`;
        })
        .finally(() => this.appStore.closeSpinner());
    },
    sendRecoverForm() {
      this.appStore.showSpinner();
      setTimeout(() => this.appStore.closeSpinner(), 3000);
    },
  },
});
</script>