<template>
<input 
  pattern="[0-9 ]*" 
  type="text"
  :id="id"
  :value="modelValue?.toString()"
  placeholder="Enter a string or drag-and-drop a file"
  @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  @dragenter="$event.preventDefault()"
  @dragover="$event.preventDefault()"
  @drop="insertValue($event)"
>
</template>

<script setup lang="ts">

defineProps<{
  modelValue: string,
  id: string,
}>()
const emit = defineEmits(['update:modelValue'])

const insertValue = (event: DragEvent) => {
  let files = event.dataTransfer!.files;
  if (files.length > 0) {
    let file = files[0]
    let reader = new FileReader();

    reader.onload = (event) => {
      emit('update:modelValue', event.target?.result)
    };

    reader.readAsText(file)
  }

  event.preventDefault();
}

</script>