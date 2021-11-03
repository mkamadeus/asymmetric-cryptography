<script setup lang="ts">
import Paillier from "./components/paillier/paillier.vue";
</script>

<template>
  <main class="container mx-auto p-6 min-h-screen">
    <!-- <h1 class="text-5xl font-bold">RSA</h1>
    <rsa /> -->
    <h1 class="text-5xl font-bold">RSA</h1>
    <rsa />
    <h1 class="text-5xl font-bold mt-10">ElGamal</h1>
    <elgamal />
    <h1 class="text-5xl font-bold mt-10">Paillier</h1>
    <paillier />
    <h1 class="text-5xl font-bold mt-10">ECC</h1>
    <ecc />
    <div class="mt-80"></div>
  </main>
</template>
