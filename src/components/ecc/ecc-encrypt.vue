<script setup lang="ts">
import cryptography from "~/utils/cryptography";
import { ECCKey } from "~/utils/cryptography/ecc";
import { Point } from "~/utils/ec";
import { bytesToBigint, eulerCrit, pow, randbigint, rootNth, strToBytes } from "~/utils/math";

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

// TODO: Fix
const loadPublicKey = (val: string) => {
  const loadedKey = val.split(" ");
  const a = BigInt(loadedKey[0]);
  const b = BigInt(loadedKey[1]);
  const p = BigInt(loadedKey[2]);
  const Bx = BigInt(loadedKey[3]);
  const By = BigInt(loadedKey[4]);
  const Qx = BigInt(loadedKey[5]);
  const Qy = BigInt(loadedKey[6]);
  const k = BigInt(loadedKey[7]);

  emit("update:keypair", {
    pub: { ec: { a, b, p }, B: { x: Bx, y: By }, Q: { x: Qx, y: Qy }, k },
    priv: props.keypair.priv,
  });
};

const result = ref("");
const encrypt = () => {
  // Encoding
  let bytes = strToBytes(props.plain);
  let encodedText: Point[] = [];

  for (let i = 0; i < bytes.length; i++) {
    // Encode to number
    let bigint = bytesToBigint(bytes.slice(i, i + 1));

    // Encode to point
    let point = encode(bigint);
    encodedText.push(point)
  }

  console.log(encodedText)

  // Encryption
  const k = randbigint(props.keypair.pub.ec.p - 2n) + 1n
  const encryptedPoints: [Point, Point][] = [];
  for (const Pm of encodedText) {
    let Pc = cryptography.ecc.encrypt(Pm, props.keypair.pub, k);
    encryptedPoints.push(Pc);
  }

  console.log(encryptedPoints)

  // Stringify
  let text: string[] = [];
  for (const Pc of encryptedPoints) {
    text.push(`${Pc[0].x},${Pc[0].y},${Pc[1].x},${Pc[1].y}`);
  }
  result.value = text.join(" ");
};

const encode = (m: bigint): Point => {
  let a = props.keypair.pub.ec.a;
  let b = props.keypair.pub.ec.b;
  let p = props.keypair.pub.ec.p;

  let x = m * props.keypair.pub.k + 1n;
  let f = (x: bigint) => pow(x, 3n) + a * x + b;

  // Find x where sqrt of y^2 exists
  let y = f(x)
  while (!eulerCrit(y, p)) {
    x++;
    y = f(x);
  }

  return {
    x: x,
    y: rootNth(y % p),
  }
}

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
        <text-input id="plain" v-model="plain" label="Plaintext" />
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
      <div class="">
        {{ result }}
      </div>
    </div>
  </div>
</template>
