<script setup lang="ts">
const plain = ref("");
const cipher = ref("");
const state = reactive({
  key: {
    pub: {
      g: 0n,
      n: 0n,
    },
    priv: {
      lambda: 0n,
      mu: 0n,
      n: 0n,
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
    <paillier-keygen v-model:keypair="state.key" />
    <div
      class="
        flex flex-col
        space-y-2 space-x-0
        md:(flex-row
        space-x-2 space-y-0)
        w-full
      "
    >
      <paillier-encrypt v-model:keypair="state.key" v-model:plain="plain" />
      <paillier-decrypt v-model:keypair="state.key" v-model:cipher="cipher" />
    </div>
  </form>
</template>
