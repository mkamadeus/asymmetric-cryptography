<script setup lang="ts">
import cryptography from "~/utils/cryptography";
import { PaillierKey } from "~/utils/cryptography/paillier";
import { bytesToBigint, calcArrayBatchSize, strToBytes } from "~/utils/math";

const props = defineProps<{
  keypair: PaillierKey;
  plain: string;
}>();

const r = ref(0n);

const emit = defineEmits(["update:keypair", "update:plain"]);

const publicKey = computed(
  () => `${props.keypair.pub.g} ${props.keypair.pub.n}`
);

const loadPublicKey = (val: string) => {
  const loadedKey = val.split(" ");
  const g = BigInt(loadedKey[0]);
  const n = BigInt(loadedKey[1]);

  emit("update:keypair", {
    pub: { g, n },
    priv: props.keypair.priv,
  });
};

const result = ref("");
const encrypt = () => {
  let arraySize = calcArrayBatchSize(props.keypair.pub.n);
  let bytes = strToBytes(props.plain);
  console.log(`bytes: ${bytes}`);

  let resList: bigint[] = [];
  if (arraySize > 0n) {
    for (let i = 0; i < bytes.length; i += Number(arraySize)) {
      let bigint = bytesToBigint(bytes.slice(i, i + Number(arraySize)));
      let res = cryptography.paillier.encrypt(bigint, props.keypair.pub, r.value);
      resList.push(res);
    }
  } else {
    let bigint = bytesToBigint(bytes);
    let res = cryptography.paillier.encrypt(bigint, props.keypair.pub, r.value);
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
          <label for="g">g</label>
          <big-int-input id="g" v-model="keypair.pub.g" />
        </div>
        <div class="flex flex-col w-full">
          <label for="n">n</label>
          <big-int-input id="n" v-model="keypair.pub.n" />
        </div>
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <file-save-button
          class="btn btn-primary-1 w-full"
          filename="paillier.pub"
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
        <label for="r">r</label>
        <big-int-input id="r" v-model="r" />
      </div>

      <div class="flex flex-col w-full">
        <text-input id="plaintext" v-model="plain" label="Plaintext" />
        <!-- <big-int-input id="plain" v-model="plain" /> -->
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <file-load-button
          class="btn btn-primary-1 w-full"
          @click="val => $emit('update:plain', val)"
        >
          Load Plaintext
        </file-load-button>
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
