<script setup lang="ts">
import { isPrime } from "./utils/math";
</script>

<template>
  <main class="container mx-auto p-6 bg-gray-800 min-h-screen">
    <div>
      {{ isPrime(5n) }}
    </div>
  </main>
</template>
