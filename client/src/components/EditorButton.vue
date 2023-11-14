<script setup lang="ts">
defineProps({
  iconName: String,
  handleClick: Function
})
</script>
<template>
  <button class="button" @click="handleClick">
    <template v-if="iconName === 'bold'"><v-icon icon="format_bold" /></template>
    <template v-if="iconName === 'italic'"><v-icon icon="format_italic" /></template>
    <template v-if="iconName === 'h1'"><span class="btn-title__bold">H1</span></template>
    <template v-if="iconName === 'h2'"><span class="btn-title__bold">H2</span></template>
    <template v-if="iconName === 'h3'"><span class="btn-title__bold">H3</span></template>
    <template v-if="iconName === 'image'"><v-icon icon="image" /></template>
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
