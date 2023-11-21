<script setup lang="ts">
import { useCssModule } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import EditorButton from '@/components/EditorButton.vue'
import Placeholder from '@tiptap/extension-placeholder'

type EditorCommands = 'bold' | 'italic' | 'h1' | 'h2' | 'h3'

const editorCommands: EditorCommands[] = ['bold', 'italic', 'h1', 'h2', 'h3']

const { initialContent } = defineProps({
  initialContent: {
    type: String,
    default: ''
  }
})

const cssModule = useCssModule()
const editor = useEditor({
  content: initialContent,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      },
      bold: {
        HTMLAttributes: {
          class: cssModule.bold
        }
      }
    }),
    Image.configure({ inline: true }),
    Placeholder.configure({
      placeholder: 'Write something …'
    })
  ],
  editorProps: {
    attributes: {
      class: cssModule.editor
    }
  }
})

defineExpose({
  getHtml: () => editor.value?.getHTML()
})

function addImage() {
  const url = window.prompt('URL')

  if (url && editor.value) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}
function format(type: EditorCommands) {
  if (editor.value) {
    const { commands } = editor.value
    const actions: Record<EditorCommands, () => void> = {
      bold: commands.toggleBold,
      italic: commands.toggleItalic,
      h1: () => commands.toggleHeading({ level: 1 }),
      h2: () => commands.toggleHeading({ level: 2 }),
      h3: () => commands.toggleHeading({ level: 3 })
    }

    actions[type]()
  }
}
</script>

<template>
  <div :class="$style.controls">
    <EditorButton
      v-for="command of editorCommands"
      :iconName="command"
      @click="() => format(command)"
      :key="command"
    />
    <EditorButton iconName="image" @click="addImage" />
  </div>
  <editor-content :editor="editor" />
</template>

<style module>
.controls {
  display: flex;
  gap: 6px;
  padding: 10px 0;
}

.bold {
  font-weight: 600;
}

.editor {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-height: 200px;
}
</style>

<style>
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>
