<template>
  <Teleport to="#overlay">
    <div
      class="p-6 md:px-12 bg-primary text-dark rounded border-2 border-secondary shadow-lg md:w-full max-w-lg relative"
    >
      <Icon icon="mdi:close-box" class="w-auto h-6 absolute top-0 right-0 m-1 cursor-pointer" @click="appStore.closeOverlay"/>
      <h1 class="text-3xl font-bold text-center pb-2">
        <slot name="title"></slot>
      </h1>
      <p>
        <slot name="description"></slot>
      </p>
      <slot name="body"></slot>
    </div>
  </Teleport>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Icon } from "@iconify/vue";
import utils from "@/utils";
import ControlStateMixin from "../../mixins/ControlStateMixin";
export default defineComponent({
  name: "ModalComponent",
  mixins: [ControlStateMixin],
  components: { Icon },
  mounted() {
    utils.disableScroll();
  },
});
</script>
