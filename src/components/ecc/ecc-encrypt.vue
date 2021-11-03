<script setup lang="ts">
// import cryptography from "~/utils/cryptography";
import { ECCKey } from "~/utils/cryptography/ecc";
// import { bytesToBigint, calcArrayBatchSize, strToBytes } from "~/utils/math";

const props = defineProps<{
  keypair: ECCKey;
  plain: string;
}>();

const emit = defineEmits(["update:keypair", "update:plain"]);

const publicKey = computed(
  () => (`${props.keypair.pub.ec.a} ${props.keypair.pub.ec.b} ${props.keypair.pub.ec.p} `
    + `${props.keypair.pub.B.x} ${props.keypair.pub.B.y} `
    + `${props.keypair.pub.Q.x} ${props.keypair.pub.Q.y} ${props.keypair.pub.k}`)
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
  // const cipher = cryptography.elgamal.encrypt(
  //   props.plain,
  //   props.keypair.pub,
  //   k.value
  // );
  // console.log(cipher);

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
    <h2 class="text-xl font-semibold mt-4">Encrypt</h2>
    <div class="flex flex-col w-full space-y-2">
      <div class="flex w-full space-x-2">
        <div class="flex flex-col w-full">
          <label for="a">ec.a</label>
          <BigIntInput id="a" v-model="keypair.pub.ec.a" />
        </div>
        <div class="flex flex-col w-full">
          <label for="b">ec.b</label>
          <BigIntInput id="b" v-model="keypair.pub.ec.b" />
        </div>
        <div class="flex flex-col w-full">
          <label for="p">ec.p</label>
          <BigIntInput id="p" v-model="keypair.pub.ec.p" />
        </div>
      </div>

      <div class="flex w-full space-x-2">
        <div class="flex flex-col w-full">
          <label for="Bx">B.x</label>
          <BigIntInput id="Bx" v-model="keypair.pub.B.x" />
        </div>
        <div class="flex flex-col w-full">
          <label for="By">B.y</label>
          <BigIntInput id="By" v-model="keypair.pub.B.y" />
        </div>
      </div>

      <div class="flex w-full space-x-2">
        <div class="flex flex-col w-full">
          <label for="Qx">Q.x</label>
          <BigIntInput id="Qx" v-model="keypair.pub.Q.x" />
        </div>
        <div class="flex flex-col w-full">
          <label for="Qy">Q.y</label>
          <BigIntInput id="Qy" v-model="keypair.pub.Q.y" />
        </div>
      </div>

      <div class="flex w-full space-x-2">
        <div class="flex flex-col w-full">
          <label for="k">k (for encoding character to points)</label>
          <BigIntInput id="k" v-model="keypair.pub.k" />
        </div>
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <file-save-button
          class="btn btn-primary-1 w-full"
          filename="ecc.pub"
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
        <label for="plain">Plain</label>
        <big-int-input id="plain" v-model="plain" />
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <file-load-button
          class="btn btn-primary-1 w-full"
          @click="$emit('update:plain', $event.value)"
        >
          Load Plaintext
        </file-load-button>
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
