<script setup lang="ts">
import cryptography from "~/utils/cryptography";
import { ElGamalKey } from "~/utils/cryptography/elgamal";
// import { bytesToBigint, calcArrayBatchSize, strToBytes } from "~/utils/math";

const props = defineProps<{
  keypair: ElGamalKey;
  plain: bigint;
}>();

const emit = defineEmits(["update:keypair", "update:plain"]);

const k = ref(0n);

const publicKey = computed(
  () => `${props.keypair.pub.p} ${props.keypair.pub.g} ${props.keypair.pub.y}`
);

const loadPublicKey = (val: string) => {
  const loadedKey = val.split(" ");
  const p = BigInt(loadedKey[0]);
  const g = BigInt(loadedKey[1]);
  const y = BigInt(loadedKey[2]);

  emit("update:keypair", {
    pub: { p, g, y },
    priv: props.keypair.priv,
  });
};

const result = ref("");
const encrypt = () => {
  const cipher = cryptography.elgamal.encrypt(
    props.plain,
    props.keypair.pub,
    k.value
  );
  console.log(cipher);

  // TODO: fix encryption
  // let arraySize = calcArrayBatchSize(n.value);
  // let bytes = strToBytes(props.plain);
  // console.log(`bytes: ${bytes}`);
  // if (arraySize == 0n) {
  //   // Attempt to encrypt as is
  //   let text = bytesToBigint(bytes);
  //   result.value = cryptography.elgamal
  //     .encrypt(text, props.keypair.pub, k.value)
  //     .toString();
  // } else {
  //   let resList: bigint[] = [];
  //   for (let i = 0; i < bytes.length; i += Number(arraySize)) {
  //     let bigint = bytesToBigint(bytes.slice(i, i + Number(arraySize)));
  //     let res = cryptography.elgamal.encrypt(
  //       bigint,
  //       props.keypair.pub,
  //       k.value
  //     );
  //     resList.push(res);
  //   }
  //   result.value = resList.join(" ");
  // }
  // result.value = cipher.toString();
};
</script>

<template>
  <div class="flex flex-col w-full">
    <h2 class="text-xl font-semibold">Encrypt</h2>
    <div class="flex flex-col w-full space-y-2">
      <div class="flex w-full space-x-2">
        <div class="flex flex-col w-full">
          <label for="p">p</label>
          <big-int-input id="p" v-model="keypair.pub.p" />
        </div>
        <div class="flex flex-col w-full">
          <label for="g">g</label>
          <big-int-input id="g" v-model="keypair.pub.g" />
        </div>
        <div class="flex flex-col w-full">
          <label for="y">y</label>
          <big-int-input id="y" v-model="keypair.pub.y" />
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
        <label for="k">k</label>
        <big-int-input id="k" v-model="k" />
      </div>
      <div class="flex flex-col w-full">
        <label for="plain">plain</label>
        <big-int-input id="plain" v-model="plain" />
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
      <div class="text-center font-bold text-5xl">
        {{ result }}
      </div>
    </div>
  </div>
</template>
