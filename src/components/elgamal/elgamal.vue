<script setup lang="ts">
const plain = ref(0n);
const cipher = ref<[bigint, bigint]>([0n, 0n]);
const state = reactive({
  key: {
    pub: {
      p: 0n,
      g: 0n,
      y: 0n,
    },
    priv: {
      x: 0n,
      p: 0n,
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
    <elgamal-keygen v-model:keypair="state.key" />
    <div
      class="
        flex flex-col
        space-y-2 space-x-0
        md:(flex-row
        space-x-2 space-y-0)
        w-full
      "
    >
      <elgamal-encrypt v-model:keypair="state.key" v-model:plain="plain" />
      <elgamal-decrypt v-model:keypair="state.key" v-model:cipher="cipher" />
    </div>
  </form>
</template>
