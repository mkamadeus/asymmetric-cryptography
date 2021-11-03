<script setup lang="ts">
import cryptography from "~/utils/cryptography";
import { ElGamalKey } from "~/utils/cryptography/elgamal";
import { bigintToBytes, bytesToStr, calcArrayBatchSize } from "~/utils/math";

const props = defineProps<{
  keypair: ElGamalKey;
  cipher: string;
}>();
const emit = defineEmits(["update:keypair", "update:cipher"]);

const privateKey = computed(
  () => `${props.keypair.priv.p} ${props.keypair.priv.x}`
);
const loadPrivateKey = (val: string) => {
  const loadedKey = val.split(" ");
  const p = BigInt(loadedKey[0]);
  const x = BigInt(loadedKey[1]);

  emit("update:keypair", {
    pub: props.keypair.pub,
    priv: { p, x },
  });
};

const result = ref("");

// TODO: fix decyrption
const decrypt = () => {
  // const plain = cryptography.elgamal.decrypt(props.cipher, props.keypair.priv);
  // result.value = plain;

  let input: [bigint, bigint][] = props.cipher.split(" ").map((i) => {
    const splitted = i.split(":");
    const mapped = [BigInt(splitted[0]), BigInt(splitted[1])];
    return mapped as [bigint, bigint];
  });
  let arraySize = calcArrayBatchSize(props.keypair.priv.p);

  let i = 0;
  if (arraySize > 0) {
    let bytes = new Uint8Array(Number(arraySize) * input.length);
    for (const bigintPair of input) {
      let res = cryptography.elgamal.decrypt(bigintPair, props.keypair.priv);
      bytes.set(bigintToBytes(res), i);
      i += Number(arraySize);
    }
    result.value = bytesToStr(bytes);
  } else {
    let res = cryptography.elgamal.decrypt(input[0], props.keypair.priv);
    let bytes = bigintToBytes(res);
    result.value = bytesToStr(bytes);
  }
};
</script>

<template>
  <div class="flex flex-col w-full">
    <h2 class="text-xl font-semibold">Decrypt</h2>
    <div class="flex flex-col w-full space-y-2">
      <div class="flex w-full space-x-2">
        <div class="flex flex-col w-full">
          <label for="p">p</label>
          <BigIntInput id="p" v-model="keypair.priv.p" />
        </div>
        <div class="flex flex-col w-full">
          <label for="x">x</label>
          <BigIntInput id="x" v-model="keypair.priv.x" />
        </div>
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <file-save-button
          class="btn btn-primary-1 w-full"
          filename="elgamal.pri"
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
        <elgamal-cipher-input id="cipher" v-model="cipher" label="Ciphertext" />
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <button class="btn btn-primary-2 w-full" @click="decrypt">
          Decrypt
        </button>
      </div>
      <div class="">
        {{ result }}
      </div>
    </div>
  </div>
</template>
