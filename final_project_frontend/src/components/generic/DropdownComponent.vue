<template>
  <div
    class="bg-light rounded p-2 relative w-full"
    :class="{ 'rounded-b-none': isOpen }"
  >
    <div class="flex justify-between items-center gap-2 w-full" @click="isOpen = !isOpen">
      <p class="text-dark" :class="{ 'text-gray': isOpen }">
        {{ selected || question }}
      </p>
      <div :class="{ 'dark-arrow-down': !isOpen, 'dark-arrow-up': isOpen }" />
    </div>
    <div
      class="absolute top-full left-0 w-full bg-light rounded-b max-h-32 overflow-y-scroll px-2"
      :class="{ 'h-fit': isOpen, 'h-0': !isOpen }"
    >
      <p
        v-for="(v, i) in stringOptions"
        :key="i"
        class="text-dark hover:bg-gray pb-2"
        @click="selectItem"
      >
        {{ v }}
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "DropdownComponent",
  emits: ["update:modelValue"],
  props: {
    question: {
      type: String,
      required: true,
    },
    options: {
      type: Object as PropType<(string | number)[]>,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
      selected: "",
    };
  },
  methods: {
    selectItem(e: Event) {
      this.selected = (e.target as HTMLElement).innerHTML;
      this.isOpen = false; 
      this.$emit("update:modelValue", this.selected);
    },
  },
  computed: {
    stringOptions() {
      return this.options.map((v) => v.toString());
    },
  },
});
</script>
