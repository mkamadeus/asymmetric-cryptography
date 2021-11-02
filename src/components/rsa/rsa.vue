<script setup lang="ts">
const plain = ref("");
const cipher = ref("");
const state = reactive({
  key: {
    pub: {
      n: 0n,
      e: 0n,
    },
    priv: {
      n: 0n,
      d: 0n,
    },
  },
});
</script>

<template>
  <form
    class="flex flex-col space-y-2"
    @submit="
      (e) => {
        e.preventDefault();
      }
    "
  >
    <rsa-keygen v-model:keypair="state.key" />
    <div
      class="
        flex flex-col
        space-y-2 space-x-0
        md:(flex-row
        space-x-2 space-y-0)
        w-full
      "
    >
      <rsa-encrypt v-model:keypair="state.key" v-model:plain="plain" />
      <rsa-decrypt v-model:keypair="state.key" v-model:cipher="cipher" />
    </div>
  </form>
</template>
