<script setup lang="ts">
import cryptography from "~/utils/cryptography";
import { cast } from "~/utils/math";

const plaintext = ref(0);
const p = ref(0);
const q = ref(0);
const result = ref(0n);

// TODO: random e
const e = 7n;

const encrypt = () => {
  console.log(p, q, e);
  const key = cryptography.rsa.keygen(cast(p.value), cast(q.value), e);
  result.value = cryptography.rsa.encrypt(cast(plaintext.value), key.pub);
};

const decrypt = () => {
  console.log(p, q, e);
  const key = cryptography.rsa.keygen(cast(p.value), cast(q.value), e);
  result.value = cryptography.rsa.decrypt(cast(plaintext.value), key.priv);
};
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
    <div class="flex flex-col">
      <label for="plaintext">Plaintext</label>
      <input
        type="number"
        id="plaintext"
        class="rsa-input"
        v-model="plaintext"
      />
    </div>
    <div class="flex w-full space-x-2">
      <div class="flex flex-col w-full">
        <label for="p">p</label>
        <input type="number" class="rsa-input" id="p" v-model="p" number />
      </div>
      <div class="flex flex-col w-full">
        <label for="q">q</label>
        <input type="number" class="rsa-input" id="q" v-model="q" number />
      </div>
    </div>
    <div class="flex flex-col space-y-2 w-full">
      <button class="btn btn-primary-1 w-full" @click="encrypt">Encrypt</button>
      <button class="btn btn-primary-2 w-full" @click="decrypt">Decrypt</button>
    </div>
    <div class="text-center font-bold text-5xl">
      {{ result }}
    </div>
  </form>
</template>

<style lang="postcss">
.rsa-input {
  @apply w-full border rounded border-gray-300;
}

label {
  @apply font-semibold;
}
</style>
