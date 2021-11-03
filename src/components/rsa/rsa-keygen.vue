<script setup lang="ts">
import cryptography from "~/utils/cryptography";
import { RSAKey } from "~/utils/cryptography/rsa";

defineProps<{ keypair: RSAKey }>();
const emit = defineEmits(["update:keypair"]);

const p = ref(0n);
const q = ref(0n);
const e = ref(0n);

const keygen = () => {
  const key = cryptography.rsa.keygen(p.value, q.value, e.value);
  emit("update:keypair", key);
};
</script>

<template>
  <div class="flex flex-col w-full">
    <h2 class="text-xl font-semibold">Keygen</h2>
    <div class="flex w-full space-x-2 mb-2">
      <div class="flex flex-col w-full">
        <label for="p">p</label>
        <big-int-input id="p" v-model="p" />
      </div>
      <div class="flex flex-col w-full">
        <label for="q">q</label>
        <big-int-input id="q" v-model="q" />
      </div>
      <div class="flex flex-col w-full">
        <label for="e">e</label>
        <big-int-input id="e" v-model="e" />
      </div>
    </div>

    <div class="flex flex-col space-y-2 w-full">
      <button class="btn btn-primary-2 w-full" @click="keygen">
        Generate Key
      </button>
    </div>
  </div>
</template>
