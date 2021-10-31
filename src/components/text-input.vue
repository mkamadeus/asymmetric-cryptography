<template>
<div class="flex flex-col">
  <label :for="id">{{label}} (Numeric)</label>
  <BigIntInput :id="id" v-model="intInput" />
  <label :for="id + 'Str'">{{label}} (Binary)</label>
  <input
    type="text"
    id="plaintextStr"
    placeholder="Enter a string or drag-and-drop a file"
    class="rsa-input"
    v-model="currVal"
    @dragenter="$event.preventDefault()"
    @dragover="$event.preventDefault()"
    @drop="insertValue($event)"
  />
</div>
</template>

<script setup lang="ts">

import { bigintToBytes, bytesToBigint, bytesToStr, strToBytes } from '~/utils/math'

const props = defineProps<{
  modelValue: string,
  id: string,
  label: string,
}>()
const emit = defineEmits(['update:modelValue'])

const intVal = ref(0n)
const prevVal = ref(props.modelValue)

const intInput = computed({
  get: () => {
    return intVal.value
  },
  set: val => {
    intVal.value = val
    let str = bytesToStr(bigintToBytes(val))
    emit('update:modelValue', str)
    prevVal.value = str
  }
})
const currVal = computed({
  get: () => {
    if (prevVal.value == props.modelValue) {
      // Get value from numeric
      if (!intInput.value) return ""
      let value = bytesToStr(bigintToBytes(intInput.value))

      // Emit value to modelvalue
      emit('update:modelValue', value)
      return value

    } else {
      prevVal.value = props.modelValue

      // Store value to numeric
      intInput.value = bytesToBigint(strToBytes(props.modelValue))
      return props.modelValue
    }
  },
  set: val => {
    // Store value to numeric
    intInput.value = bytesToBigint(strToBytes(val))

    // Emit value to modelvalue
    emit('update:modelValue', val)
  }
})

const insertValue = (event: DragEvent) => {
  let files = event.dataTransfer!.files;
  if (files.length > 0) {
    let file = files[0]
    let reader = new FileReader();

    reader.onload = (event) => {
      console.log(event.target!.result);
      emit('update:modelValue', BigInt(event.target!.result as string).valueOf())
    };

    reader.readAsText(file)
  }

  event.preventDefault();
}

</script>