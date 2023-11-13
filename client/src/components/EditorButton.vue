<script setup lang="ts">
import { useCssModule } from 'vue'
import IconImage from '@/components/icons/IconImage.vue'

const cssModule = useCssModule()

const icons = {
  bold: {
    icon: 'B',
    class: cssModule.bold
  },
  italic: {
    icon: 'I',
    class: cssModule.italic
  },
  image: {
    icon: 'Image'
  },
  h1: {
    icon: 'H1'
  },
  h2: {
    icon: 'H2'
  },
  h3: {
    icon: 'H3'
  }
}

defineProps({
  iconName: String,
  handleClick: Function
})
</script>
<template>
  <button @click="handleClick" :class="[icons[iconName].class, $style.button]">
    {{ icons[iconName].icon }}
  </button>
</template>
<style module>
.bold {
  font-weight: 600;
}

.italic {
  font-style: italic;
}

.button {
  background-color: #e0e0e0;
  padding: 0.25em 0.5em;
  font-size: 1.2em;
  border-radius: 6px;
  border: 1px solid #848484;
  cursor: pointer;
  min-width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
