<script setup lang="ts">
import cryptography from "~/utils/cryptography";
import { bigintToBytes, bytesToBigint, bytesToStr, calcArrayBatchSize, strToBytes } from "~/utils/math";
import BigIntInput from "./big-int-input.vue";
import TextInput from "./text-input.vue";
import FileLoadButton from "./file-load-button.vue";
import RsaCipherInput from "./rsa-cipher-input.vue";
import FileSaveButton from "./file-save-button.vue";

const p = ref(0n);
const q = ref(0n);
const e = ref(7n);
const n = ref(0n);
const d = ref(0n);
const resCipher = ref("");
const resPlain = ref("");
const key = computed(() => {
  return {
    pub: {
      n: n.value,
      e: e.value,
    },
    priv: {
      n: n.value,
      d: d.value,
    },
  };
})

const plaintext = ref("");
const ciphertext = ref("");

const priKey = computed(() => `${key.value.priv.n} ${key.value.priv.d}`)
const pubKey = computed(() => `${key.value.pub.n} ${key.value.pub.e}`)

// TODO: random e
// const e = 7n;

const encrypt = () => {
  console.log(p, q, e);
  if (!n.value || !e.value)
    keygen();
  
  let arraySize = calcArrayBatchSize(n.value);
  let bytes = strToBytes(plaintext.value);
  console.log(`bytes: ${bytes}`)
  if (arraySize == 0n) {
    // Attempt to encrypt as is
    let text = bytesToBigint(bytes);
    resCipher.value = cryptography.rsa.encrypt(text, key.value.pub).toString();
  }
  else {
    let resList: bigint[] = [];
    for (let i = 0; i < bytes.length; i += Number(arraySize)) {
      let bigint = bytesToBigint(bytes.slice(i, i + Number(arraySize)));
      let res = cryptography.rsa.encrypt(bigint, key.value.pub);
      resList.push(res);
    }
    resCipher.value = resList.join(" ")
  }
};

const decrypt = () => {
  console.log(p, q, e);

  if (!n.value || !d.value)
    keygen();
  
  let input = ciphertext.value.split(" ");
  let arraySize = calcArrayBatchSize(n.value);
  let bytes = new Uint8Array(Number(arraySize) * input.length);

  let i = 0;
  for (const bigintStr of input) {
    let bigint = BigInt(bigintStr);
    let res = cryptography.rsa.decrypt(bigint, key.value.priv);
    bytes.set(bigintToBytes(res), i);
    i += Number(arraySize);
  }

  resPlain.value = bytesToStr(bytes)
};

const keygen = () => {
  let tempKey = cryptography.rsa.keygen(p.value, q.value, e.value);
  n.value = tempKey.priv.n;
  d.value = tempKey.priv.d;
}

const insertPublicKey = (val: string) => {
  let key = val.split(" ")
  n.value = BigInt(key[0])
  e.value = BigInt(key[1])
}

const insertPrivateKey = (val: string) => {
  let key = val.split(" ")
  n.value = BigInt(key[0])
  d.value = BigInt(key[1])
}
</script>

<template>
  <form
    class="flex flex-col space-y-2"
    @submit="
      (e) => {
        e.preventDefault();
      }
    "
  >
    <h2>Keygen</h2>
    <div class="flex w-full space-x-2">
      <div class="flex flex-col w-full">
        <label for="p">p</label>
        <BigIntInput id="p" v-model="p" />
      </div>
      <div class="flex flex-col w-full">
        <label for="q">q</label>
        <BigIntInput id="q" v-model="q" />
      </div>
      <div class="flex flex-col w-full">
        <label for="e">e</label>
        <BigIntInput id="e" v-model="e" />
      </div>
    </div>

    <div class="flex flex-col space-y-2 w-full">
      <button class="btn btn-primary-2 w-full" @click="keygen">Generate Key</button>
    </div>
    
    <div class="flex w-full space-x-2">
      <div class="flex flex-col w-full space-y-2">
        <div class="flex w-full space-x-2">
          <div class="flex flex-col w-full">
            <label for="n">n</label>
            <BigIntInput id="n" v-model="n" />
          </div>
          <div class="flex flex-col w-full">
            <label for="e">e</label>
            <BigIntInput id="e" v-model="e" />
          </div>
        </div>

        <div class="flex flex-col space-y-2 w-full">
          <FileSaveButton class="btn btn-primary-1 w-full" filename="rsa.pri" :data="pubKey">Save Public Key</FileSaveButton>
          <FileLoadButton class="btn btn-primary-1 w-full" @click="val => insertPublicKey(val)">Load Public Key</FileLoadButton>
        </div>

        <TextInput id="plaintext" v-model="plaintext" label="Plaintext"/>

        <div class="flex flex-col space-y-2 w-full">
          <FileLoadButton class="btn btn-primary-1 w-full" @click="val => plaintext = val">Load Plaintext</FileLoadButton>
          <button class="btn btn-primary-2 w-full" @click="encrypt">Encrypt</button>
        </div>
        <div class="text-center font-bold text-5xl">
          {{ resCipher }}
        </div>
      </div>

      <div class="flex flex-col w-full  space-y-2">
        <div class="flex w-full space-x-2">
          <div class="flex flex-col w-full">
            <label for="n">n</label>
            <BigIntInput id="n" v-model="n" />
          </div>
          <div class="flex flex-col w-full">
            <label for="d">d</label>
            <BigIntInput id="d" v-model="d" />
          </div>
        </div>

        <div class="flex flex-col space-y-2 w-full">
          <FileSaveButton class="btn btn-primary-1 w-full" filename="rsa.pub" :data="priKey">Save Public Key</FileSaveButton>
          <FileLoadButton class="btn btn-primary-1 w-full" @click="val => insertPrivateKey(val)">Load Private Key</FileLoadButton>
        </div>

        <div class="flex flex-col w-full">
          <label for="ciphertext">Ciphertext</label>
          <RsaCipherInput id="ciphertext" v-model="ciphertext" label="Ciphertext"/>
        </div>

        <div class="flex flex-col space-y-2 w-full">
          <FileLoadButton class="btn btn-primary-1 w-full" @click="val => ciphertext = val">Load Ciphertext</FileLoadButton>
          <button class="btn btn-primary-2 w-full" @click="decrypt">Decrypt</button>
        </div>
        <div class="text-center font-bold text-5xl">
          {{ resPlain }}
        </div>
      </div>
    </div>
  </form>
</template>

<style lang="postcss">
.rsa-input {
  @apply w-full border rounded border-gray-300;
}

label {
  @apply font-semibold;
}
</style>
