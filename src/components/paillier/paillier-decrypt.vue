<script setup lang="ts">
import cryptography from "~/utils/cryptography";
import { PaillierKey } from "~/utils/cryptography/paillier";
import { bigintToBytes, bytesToStr, calcArrayBatchSize } from "~/utils/math";

const props = defineProps<{
  keypair: PaillierKey;
  cipher: string;
}>();
const emit = defineEmits(["update:keypair", "update:cipher"]);

const privateKey = computed(
  () =>
    `${props.keypair.priv.lambda} ${props.keypair.priv.mu} ${props.keypair.priv.n}`
);
const loadPrivateKey = (val: string) => {
  const loadedKey = val.split(" ");
  const lambda = BigInt(loadedKey[0]);
  const mu = BigInt(loadedKey[1]);
  const n = BigInt(loadedKey[2]);

  emit("update:keypair", {
    pub: props.keypair.pub,
    priv: { lambda, mu, n },
  });
};

const result = ref("");

// TODO: fix decyrption
const decrypt = () => {
  // const plain = cryptography.rsa.decrypt(props.cipher, props.keypair.priv);
  // result.value = plain;

  let input = props.cipher.split(" ");
  let arraySize = calcArrayBatchSize(props.keypair.priv.n);
  let bytes = new Uint8Array(Number(arraySize) * input.length);

  let i = 0;
  for (const bigintStr of input) {
    let bigint = BigInt(bigintStr);
    let res = cryptography.paillier.decrypt(bigint, props.keypair.priv);
    bytes.set(bigintToBytes(res), i);
    i += Number(arraySize);
  }

  result.value = bytesToStr(bytes);
};
</script>

<template>
  <div class="flex flex-col w-1/2">
    <h2 class="text-xl font-semibold">Decrypt</h2>
    <div class="flex flex-col w-full space-y-2">
      <div class="flex w-full space-x-2">
        <div class="flex flex-col w-full">
          <label for="lambda">lambda</label>
          <big-int-input id="lambda" v-model="keypair.priv.lambda" />
        </div>
        <div class="flex flex-col w-full">
          <label for="mu">mu</label>
          <big-int-input id="mu" v-model="keypair.priv.mu" />
        </div>
        <div class="flex flex-col w-full">
          <label for="n">n</label>
          <big-int-input id="n" v-model="keypair.priv.n" />
        </div>
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <file-save-button
          class="btn btn-primary-1 w-full"
          filename="paillier.pri"
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
        <paillier-cipher-input
          id="cipher"
          v-model="cipher"
          label="Ciphertext"
        />
      </div>

      <div class="flex flex-col space-y-2 w-full">
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
