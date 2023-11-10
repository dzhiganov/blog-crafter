<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

const props = defineProps({
  content: String
})

const editor = useEditor({
  content: props.content,
  extensions: [StarterKit, Image.configure({ inline: true })]
})
</script>

<template>
  <editor-content :editor="editor" />
</template>

<style scoped></style>
