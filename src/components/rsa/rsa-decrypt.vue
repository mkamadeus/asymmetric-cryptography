<script setup lang="ts">
import cryptography from "~/utils/cryptography";
import { RSAKey } from "~/utils/cryptography/rsa";
import { bigintToBytes, bytesToStr, calcArrayBatchSize } from "~/utils/math";

const props = defineProps<{
  keypair: RSAKey;
  cipher: string;
}>();
const emit = defineEmits(["update:keypair", "update:cipher"]);

const privateKey = computed(
  () => `${props.keypair.priv.n} ${props.keypair.priv.d}`
);
const loadPrivateKey = (val: string) => {
  const loadedKey = val.split(" ");
  const n = BigInt(loadedKey[0]);
  const d = BigInt(loadedKey[1]);

  emit("update:keypair", {
    pub: props.keypair.pub,
    priv: { n, d },
  });
};

const result = ref("");

// TODO: fix decyrption
const decrypt = () => {
  // const plain = cryptography.rsa.decrypt(props.cipher, props.keypair.priv);
  // result.value = plain;

  let input = props.cipher.split(" ");
  let arraySize = calcArrayBatchSize(props.keypair.priv.n);

  let i = 0;
  if (arraySize > 0) {
    let bytes = new Uint8Array(Number(arraySize) * input.length);
    for (const bigintStr of input) {
      let bigint = BigInt(bigintStr);
      let res = cryptography.rsa.decrypt(bigint, props.keypair.priv);
      bytes.set(bigintToBytes(res), i);
      i += Number(arraySize);
    }
    result.value = bytesToStr(bytes);
  } else {
    let bigint = BigInt(input[0]);
    let res = cryptography.rsa.decrypt(bigint, props.keypair.priv);
    let bytes = bigintToBytes(res);
    result.value = bytesToStr(bytes);
  }
};
</script>

<template>
  <div class="flex flex-col w-1/2">
    <h2 class="text-xl font-semibold">Decrypt</h2>
    <div class="flex flex-col w-full space-y-2">
      <div class="flex w-full space-x-2">
        <div class="flex flex-col w-full">
          <label for="n">n</label>
          <big-int-input id="n" v-model="keypair.priv.n" />
        </div>
        <div class="flex flex-col w-full">
          <label for="d">d</label>
          <big-int-input id="d" v-model="keypair.priv.d" />
        </div>
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <file-save-button
          class="btn btn-primary-1 w-full"
          filename="rsa.pri"
          :data="privateKey"
          >Save Private Key</file-save-button
        >
        <file-load-button
          class="btn btn-primary-1 w-full"
          @click="loadPrivateKey"
          >Load Private Key</file-load-button
        >
      </div>

      <div class="flex flex-col w-full">
        <!-- <text-input id="cipher" v-model="cipher" label="Ciphertext" /> -->
        <!-- <big-int-input id="cipher" v-model="cipher" /> -->
        <label for="cipher">Ciphertext</label>
        <rsa-cipher-input id="cipher" v-model="cipher" label="Ciphertext" />
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <file-load-button
          class="btn btn-primary-1 w-full"
          @click="val => $emit('update:cipher', val)"
        >
          Load Ciphertext
        </file-load-button>
        <button class="btn btn-primary-2 w-full" @click="decrypt">
          Decrypt
        </button>
      </div>
    </div>
    <div class="">
      {{ result }}
    </div>
  </div>
</template>
