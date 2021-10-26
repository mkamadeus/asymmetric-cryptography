<script setup lang="ts">
import { rsaGenerateKey, rsaEncrypt } from "./utils/cryptography";

const result = ref(0n);
const plain = ref("");
const key = computed(() => rsaGenerateKey(3n, 11n, 7n));
</script>

<template>
  <main class="container mx-auto p-6 min-h-screen">
    <div class="flex flex-col">
      <label for="plain">Plaintext</label>
      <input type="number" id="plain" v-model="plain" />
    </div>
    <div>
      <button
        class="w-full text-center bg-blue-500 text-white p-2"
        @click="
          () => {
            result = rsaEncrypt(BigInt(plain).valueOf(), key);
          }
        "
      >
        Encrypt
      </button>
    </div>
    <div>
      {{ result }}
    </div>
  </main>
</template>
