<template>
  <div class="p-2 bg-red text-light">
    <b>Lo sentimos, estamos expermimentando errores!</b>
    <p>Le recomendamos esperar unos segundos e intentarlo nuevamente</p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({name:"ErrorMessageComponent"})
</script>