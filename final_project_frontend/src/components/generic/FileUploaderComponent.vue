<template>
  <!-- Carga de imagen -->
  <div
    class="m-auto w-fit flex items-start gap-2 p-4 rounded"
    :class="isDragEnter ? 'bg-gray' : 'bg-light'"
    @click="openHandler"
    ref="dropZone"
  >
    <div
      class="bg-light rounded-full border-2 grid place-items-center"
      :class="isDragEnter ? 'border-primary' : 'border-transparent'"
    >
      <Icon
        v-if="isImage"
        class="text-dark text-3xl m-4"
        icon="tabler:camera-plus"
      />
      <Icon v-else class="text-dark text-3xl m-4" icon="tabler:file" />
    </div>
    <div class="flex flex-col items-start">
      <p class="text-dark">{{ title }}</p>
      <small class="text-secondary"
        >Haz click o arrastra para cargar tu/s archivos</small
      >
      <small class="text-secondary font-bold" v-if="extensions"
        >{{ maxFiles }} file/s - [{{ extensions.join(", ") }}]</small
      >
      <div v-if="uploadedFiles.length" class="text-dark mt-2 w-full">
        <hr>
        <h3>Archivos cargados:</h3>
        <ul class="list-decimal">
          <li v-for="(v, i) in uploadedFiles" :key="i" class="text-sm">
            <p>{{ v.name }}</p>
            <small> {{ (v.size / 1024 ** 2).toFixed(2) }}mb</small>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
/*  NOTE: El bind @drop no existe en la doc de vue, sin embargo funciona pero como le sale de los huevos
    pero mis panas de VueUse desarrollaron un set de utilidades (incluida el file drag), dales un
    ojo, tienen muchas cosas interesantes */
import { defineComponent, PropType } from "vue";
import { Icon } from "@iconify/vue";
import { useDropZone, useFileDialog } from "@vueuse/core";

export default defineComponent({
  name: "FileUploaderComponent",
  components: { Icon },
  emits: ["update:modelValue"],
  props: {
    title: {
      type: String,
      required: true,
    },
    maxFiles: {
      type: Number,
      required: true,
    },
    extensions: Object as PropType<string[] | String>,
    isImage: Boolean,
  },
  data() {
    return {
      isDragEnter: null as any,
      openHandler: null as any,
      uploadedFiles: [] as File[],
    };
  },
  mounted() {
    // Drop
    const dropZoneRef = this.$refs.dropZone as HTMLDivElement;
    const { isOverDropZone } = useDropZone(dropZoneRef, this.dropHandler);
    this.isDragEnter = isOverDropZone;

    // Click
    const { open, onChange } = useFileDialog();
    this.openHandler = open;
    onChange(this.clickHandler);
  },
  methods: {
    dropHandler(files: File[] | null) {
      if (!files) {
        return;
      }
      this.filesHandler(files.slice(0, this.maxFiles));
    },
    clickHandler(fileList: FileList | null) {
      if (!fileList) {
        return;
      }
      const files: File[] = [];
      for (let i = 0; i < this.maxFiles; i++) {
        if (i >= fileList.length) {
          break;
        }
        files.push(fileList.item(i)!);
      }
      this.filesHandler(files);
    },
    filesHandler(files: File[]) {
      if (this.extensions) {
        files = files.filter((v) => {
          const extension = v.name.split(".");
          return this.extensions.includes(extension[extension.length - 1]);
        });
      }
      this.uploadedFiles = files;
      this.$emit("update:modelValue", files);
    },
  },
});
</script>
