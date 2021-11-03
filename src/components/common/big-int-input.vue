<template>
  <input
    inputmode="numeric"
    pattern="\-[0-9]*"
    type="text"
    :id="id"
    :value="modelValue?.toString()"
    @input="$emit('update:modelValue', BigInt(($event.target as HTMLInputElement).value).valueOf())"
    @dragenter="$event.preventDefault()"
    @dragover="$event.preventDefault()"
    @drop="insertValue($event)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: bigint;
  id: string;
}>();
const emit = defineEmits(["update:modelValue"]);

const insertValue = (event: DragEvent) => {
  let files = event.dataTransfer!.files;
  if (files.length > 0) {
    let file = files[0];
    let reader = new FileReader();

    reader.onload = (event) => {
      emit(
        "update:modelValue",
        BigInt(event.target?.result as string).valueOf()
      );
    };

    reader.readAsText(file);
  }

  event.preventDefault();
};
</script>
