<template>
  <button
    :class="class"
    @click="fileDialog()"
    @dragenter="$event.preventDefault()"
    @dragover="$event.preventDefault()"
    @drop="insertValue($event)"
  >
    <slot />
    <input
      type="file"
      ref="fileInput"
      @change="readFile()"
      style="display: none"
    />
  </button>
</template>

<script setup lang="ts">
defineProps<{ class: string }>();
const emit = defineEmits(["click"]);

const fileInput = ref<HTMLInputElement>();

const fileDialog = () => {
  fileInput.value!.click();
};

const readFile = () => {
  if (fileInput.value!.files!.length <= 0) return;

  let reader = new FileReader();
  reader.onload = (event) => {
    emit("click", event.target?.result as string);
  };

  reader.readAsText(fileInput.value!.files![0]);
};

const insertValue = (event: DragEvent) => {
  let files = event.dataTransfer!.files;
  if (files.length > 0) {
    let file = files[0];
    let reader = new FileReader();

    reader.onload = (event) => {
      emit("click", event.target?.result as string);
    };

    reader.readAsText(file);
  }

  event.preventDefault();
};
</script>
