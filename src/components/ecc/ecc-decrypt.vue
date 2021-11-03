<script setup lang="ts">
// import cryptography from "~/utils/cryptography";
import { ECCKey } from "~/utils/cryptography/ecc";

const props = defineProps<{
  keypair: ECCKey;
  cipher: string;
}>();
const emit = defineEmits(["update:keypair", "update:cipher"]);

const privateKey = computed(
  () => (`${props.keypair.priv.ec.a} ${props.keypair.priv.ec.b} ${props.keypair.priv.ec.p} `
    + `${props.keypair.priv.B.x} ${props.keypair.priv.B.y} `
    + `${props.keypair.priv.x} ${props.keypair.priv.k}`)
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

const result = ref(0n);

// TODO: fix decyrption
const decrypt = () => {
  // const plain = cryptography.elgamal.decrypt(props.cipher, props.keypair.priv);
  // result.value = plain;
};
</script>

<template>
  <div class="flex flex-col w-full">
    <h2 class="text-xl font-semibold mt-4">Decrypt</h2>
    <div class="flex flex-col w-full space-y-2">
      <div class="flex w-full space-x-2">
        <div class="flex flex-col w-full">
          <label for="a">ec.a</label>
          <BigIntInput id="a" v-model="keypair.priv.ec.a" />
        </div>
        <div class="flex flex-col w-full">
          <label for="b">ec.b</label>
          <BigIntInput id="b" v-model="keypair.priv.ec.b" />
        </div>
        <div class="flex flex-col w-full">
          <label for="p">ec.p</label>
          <BigIntInput id="p" v-model="keypair.priv.ec.p" />
        </div>
      </div>

      <div class="flex w-full space-x-2">
        <div class="flex flex-col w-full">
          <label for="Bx">B.x</label>
          <BigIntInput id="Bx" v-model="keypair.priv.B.x" />
        </div>
        <div class="flex flex-col w-full">
          <label for="By">B.y</label>
          <BigIntInput id="By" v-model="keypair.priv.B.y" />
        </div>
      </div>

      <div class="flex w-full space-x-2">
        <div class="flex flex-col w-full">
          <label for="x">x</label>
          <BigIntInput id="x" v-model="keypair.priv.x" />
        </div>
        <div class="flex flex-col w-full">
          <label for="k">k (for encoding character to points)</label>
          <BigIntInput id="k" v-model="keypair.priv.k" />
        </div>
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <file-save-button
          class="btn btn-primary-1 w-full"
          filename="ecc.pri"
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
        <label for="plain">Ciphertext</label>
        <big-int-input id="plain" v-model="cipher" />
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <file-load-button
          class="btn btn-primary-1 w-full"
          @click="$emit('update:cipher', $event.value)"
        >
          Load Plaintext
        </file-load-button>
        <button class="btn btn-primary-2 w-full" @click="decrypt">
          Decrypt
        </button>
      </div>
      <div class="text-center font-bold text-5xl">
        {{ result }}
      </div>
    </div>
  </div>
</template>
