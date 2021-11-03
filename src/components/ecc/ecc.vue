<script setup lang="ts">
const plain = ref("");
const cipher = ref("");
const state = reactive({
  key: {
    pub: {
      ec: { a: 0n, b: 0n, p: 2n },
      B: { x: 0n, y: 0n },
      Q: { x: 0n, y: 0n },
      k: 1n,
    },
    priv: {
      ec: { a: 0n, b: 0n, p: 2n },
      B: { x: 0n, y: 0n },
      x: 0n,
      k: 1n,
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
    <ecc-keygen v-model:keypair="state.key" />
    <div
      class="
        flex flex-col
        space-y-2 space-x-0
        md:(flex-row
        space-x-2 space-y-0)
        w-full
      "
    >
      <ecc-encrypt v-model:keypair="state.key" v-model:plain="plain" />
      <ecc-decrypt v-model:keypair="state.key" v-model:cipher="cipher" />
    </div>
  </form>
</template>
