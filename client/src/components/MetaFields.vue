<script lang="ts" setup>
import { ref } from 'vue'

const { initialData } = defineProps({
  initialData: {
    type: Object,
    default: null
  }
})

defineExpose({
  getMetaData: () => Object.fromEntries(fields.value)
})

const fields = ref<[string, string][]>(initialData ? Object.entries(initialData) : [])

function addField() {
  fields.value.push(['', ''])
}
</script>
<template>
  <div :class="$style.inputs">
    <template v-for="(_t, index) in fields" :key="index">
      <div :class="$style.inputRow">
        <v-text-field
          density="compact"
          variant="underlined"
          label="Key"
          v-model="fields[index][0]"
        />

        <v-text-field
          density="compact"
          variant="underlined"
          label="Value"
          v-model="fields[index][1]"
        />
      </div>
    </template>
    <v-btn variant="tonal" density="comfortable" class="text-subtitle-1" @click="addField"
      >Add field</v-btn
    >
  </div>
</template>
<style module>
.inputRow {
  display: flex;
  gap: 16px;
  max-width: 600px;
}
</style>
