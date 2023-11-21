<script setup lang="ts">
defineProps({
  iconName: String
})

const emits = defineEmits({
  click: Function
})

function handleClick() {
  emits('click')
}
</script>
<template>
  <button class="button" @click="handleClick">
    <v-icon v-if="iconName === 'bold'" icon="format_bold" />
    <v-icon v-if="iconName === 'italic'" icon="format_italic" />
    <span v-if="iconName === 'h1'" class="btn-title__bold">H1</span>
    <span v-if="iconName === 'h2'" class="btn-title__bold">H2</span>
    <span v-if="iconName === 'h3'" class="btn-title__bold">H3</span>
    <v-icon v-if="iconName === 'image'" icon="image" />
  </button>
</template>

<style scoped>
.btn-title__bold {
  font-weight: 800;
}

.button {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-radius: 4px;
  width: 38px;
  height: 38px;
}

.button:hover {
  background-color: #e7e7e7;
}
</style>
