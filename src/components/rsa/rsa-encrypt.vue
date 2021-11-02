<script setup lang="ts">
import cryptography from "~/utils/cryptography";
import { RSAKey } from "~/utils/cryptography/rsa";
import { bytesToBigint, calcArrayBatchSize, strToBytes } from "~/utils/math";

const props = defineProps<{
  keypair: RSAKey;
  plain: string;
}>();

const emit = defineEmits(["update:keypair", "update:plain"]);

const publicKey = computed(
  () => `${props.keypair.pub.n} ${props.keypair.pub.e}`
);

const loadPublicKey = (val: string) => {
  const loadedKey = val.split(" ");
  const n = BigInt(loadedKey[0]);
  const e = BigInt(loadedKey[1]);

  emit("update:keypair", {
    pub: { n, e },
    priv: props.keypair.priv,
  });
};

const result = ref("");
const encrypt = () => {
  let arraySize = calcArrayBatchSize(props.keypair.pub.n);
  let bytes = strToBytes(props.plain);
  console.log(`bytes: ${bytes}`);

  let resList: bigint[] = [];
  for (let i = 0; i < bytes.length; i += Number(arraySize)) {
    let bigint = bytesToBigint(bytes.slice(i, i + Number(arraySize)));
    let res = cryptography.rsa.encrypt(bigint, props.keypair.pub);
    resList.push(res);
  }

  result.value = resList.toString().replace(/,/g, " ");
};
</script>

<template>
  <div class="flex flex-col w-1/2">
    <h2 class="text-xl font-semibold">Encrypt</h2>
    <div class="flex flex-col w-full space-y-2 mb-2">
      <div class="flex w-full space-x-2">
        <div class="flex flex-col w-full">
          <label for="n">n</label>
          <big-int-input id="n" v-model="keypair.pub.n" />
        </div>
        <div class="flex flex-col w-full">
          <label for="e">e</label>
          <big-int-input id="e" v-model="keypair.pub.e" />
        </div>
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <file-save-button
          class="btn btn-primary-1 w-full"
          filename="rsa.pri"
          :data="publicKey"
          >Save Public Key</file-save-button
        >
        <file-load-button
          class="btn btn-primary-1 w-full"
          @click="loadPublicKey"
          >Load Public Key</file-load-button
        >
      </div>

      <div class="flex flex-col w-full">
        <text-input id="plaintext" v-model="plain" label="Plaintext" />
        <!-- <big-int-input id="plain" v-model="plain" /> -->
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <!-- <file-load-button
        class="btn btn-primary-1 w-full"
        @click="$emit('update:plain', $event.value)"
        >Load Plaintext</file-load-button
      > -->
        <button class="btn btn-primary-2 w-full" @click="encrypt">
          Encrypt
        </button>
      </div>
    </div>
    <div class="">
      {{ result }}
    </div>
  </div>
</template>
