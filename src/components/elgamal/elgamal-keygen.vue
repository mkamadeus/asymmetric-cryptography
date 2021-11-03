<script setup lang="ts">
import cryptography from "~/utils/cryptography";
import { ElGamalKey } from "~/utils/cryptography/elgamal";

defineProps<{ keypair: ElGamalKey }>();
const emit = defineEmits(["update:keypair"]);

const p = ref(0n);
const g = ref(0n);
const x = ref(0n);

const keygen = () => {
  const key = cryptography.elgamal.keygen(p.value, g.value, x.value);
  emit("update:keypair", key);
};
</script>

<template>
  <div class="flex flex-col w-full">
    <h2 class="text-xl font-semibold mt-4">Keygen</h2>
    <div class="flex w-full space-x-2 mb-2">
      <div class="flex flex-col w-full">
        <label for="p">p</label>
        <BigIntInput id="p" v-model="p" />
      </div>
      <div class="flex flex-col w-full">
        <label for="g">g</label>
        <BigIntInput id="g" v-model="g" />
      </div>
      <div class="flex flex-col w-full">
        <label for="x">x</label>
        <BigIntInput id="x" v-model="x" />
      </div>
    </div>

    <div class="flex flex-col space-y-2 w-full">
      <button class="btn btn-primary-2 w-full" @click="keygen">
        Generate Key
      </button>
    </div>
  </div>
</template>
