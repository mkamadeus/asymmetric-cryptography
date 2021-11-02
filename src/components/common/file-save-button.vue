<template>
  <button :class="class" @click="fileDialog()">
    <slot />
    <a
      :href="'data:text/plain;charset=utf-8,' + data"
      :download="filename"
      ref="fileOutput"
      style="display: none"
    />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  class: string;
  filename: string;
  data: string;
}>();

const fileOutput = ref<HTMLLinkElement>();

const fileDialog = () => {
  fileOutput.value!.click();
};
</script>
