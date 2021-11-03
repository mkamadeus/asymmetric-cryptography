<script setup lang="ts">
import cryptography from "~/utils/cryptography";
import { ECCKey } from "~/utils/cryptography/ecc";

defineProps<{ keypair: ECCKey }>();
const emit = defineEmits(["update:keypair"]);

const a = ref(0n);
const b = ref(0n);
const p = ref(2n);
const Bx = ref(0n);
const By = ref(0n);
const x = ref(0n);
const k = ref(1n);

const keygen = () => {
  const ec = { a: a.value, b: b.value, p: p.value };
  const B = { x: Bx.value, y: By.value };
  const key = cryptography.ecc.keygen(ec, B, x.value, k.value);
  emit("update:keypair", key);
};
</script>

<template>
  <div class="flex flex-col w-full space-y-2">
    <h2 class="text-xl font-semibold mt-4">Keygen</h2>

    <div class="flex w-full space-x-2">
      <div class="flex flex-col w-full">
        <label for="a">ec.a</label>
        <BigIntInput id="a" v-model="a" />
      </div>
      <div class="flex flex-col w-full">
        <label for="b">ec.b</label>
        <BigIntInput id="b" v-model="b" />
      </div>
      <div class="flex flex-col w-full">
        <label for="p">ec.p</label>
        <BigIntInput id="p" v-model="p" />
      </div>
    </div>

    <div class="flex w-full space-x-2">
      <div class="flex flex-col w-full">
        <label for="Bx">B.x</label>
        <BigIntInput id="Bx" v-model="Bx" />
      </div>
      <div class="flex flex-col w-full">
        <label for="By">B.y</label>
        <BigIntInput id="By" v-model="By" />
      </div>
    </div>

    <div class="flex w-full space-x-2">
      <div class="flex flex-col w-full">
        <label for="x">x</label>
        <BigIntInput id="x" v-model="x" />
      </div>
      <div class="flex flex-col w-full">
        <label for="k">k (for encoding character to points)</label>
        <BigIntInput id="k" v-model="k" />
      </div>
    </div>

    <div class="flex flex-col space-y-2 w-full">
      <button class="btn btn-primary-2 w-full" @click="keygen">
        Generate Key
      </button>
    </div>
  </div>
</template>
