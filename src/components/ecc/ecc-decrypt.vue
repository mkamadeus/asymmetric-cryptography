<script setup lang="ts">
import cryptography from "~/utils/cryptography";
import { ECCKey } from "~/utils/cryptography/ecc";
import { Point } from "~/utils/ec";
import { bigintToBytes, bytesToStr } from "~/utils/math";

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
  const a = BigInt(loadedKey[0]);
  const b = BigInt(loadedKey[1]);
  const p = BigInt(loadedKey[2]);
  const Bx = BigInt(loadedKey[3]);
  const By = BigInt(loadedKey[4]);
  const x = BigInt(loadedKey[5]);
  const k = BigInt(loadedKey[6]);

  emit("update:keypair", {
    pub: props.keypair.pub,
    priv: { ec: { a, b, p }, B: { x: Bx, y: By }, x, k },
  });
};

const result = ref("");

// TODO: fix decyrption
const decrypt = () => {
  // Parse Text
  const text = props.cipher.split(" ");
  const encryptedPoints: [Point, Point][] = [];

  for (const pointStr of text) {
    let attrs = pointStr.split(',');
    let a = { x: BigInt(attrs[0]), y: BigInt(attrs[1]) };
    let b = { x: BigInt(attrs[2]), y: BigInt(attrs[3]) };

    encryptedPoints.push([a, b])
  }

  console.log(encryptedPoints)

  // Decryption
  let encodedText: Point[] = [];
  for (const Pc of encryptedPoints) {
    let Pm = cryptography.ecc.decrypt(Pc, props.keypair.priv);
    encodedText.push(Pm);
  }

  console.log(encodedText)

  // Decoding
  let bytes = new Uint8Array(encodedText.length);
  for (let i = 0; i < encodedText.length; i++) {
    // Decode to number
    let bigint = decode(encodedText[i]);

    // Decode to byte
    let byte = bigintToBytes(bigint);
    bytes.set(byte, i);
  }

  result.value = bytesToStr(bytes);
};

const decode = (c: Point): bigint => {
  return (c.x - 1n) / props.keypair.priv.k;
}
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
        <ecc-cipher-input id="plain" v-model="cipher" />
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
      <div class="">
        {{ result }}
      </div>
    </div>
  </div>
</template>
