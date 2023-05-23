<template>
  <router-view/>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import controlStateMixin from "@/mixins/controlStateMixin.ts";
export default defineComponent({
  mixins: [controlStateMixin],
  created() {
    this.userStore.getOrUpdateUserInfo();
  },
});
</script>
