<script lang="ts" setup>
import { ref, useCssModule } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useRoute } from 'vue-router'
import { useCreateNewArticle } from '@/queries/articles'
import EditorButton from '@/components/EditorButton.vue'
import Placeholder from '@tiptap/extension-placeholder'

const cssModule = useCssModule()

const route = useRoute()
const editor = useEditor({
  content: '',
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
const fields = ref<[string, string][]>([])
const name = ref('')

const { mutate: createNewArticle } = useCreateNewArticle()

function handleSave() {
  const meta = Object.fromEntries(fields.value)
  // TODO Check this place

  createNewArticle({
    name: name.value,
    path: route.params.id,
    meta,
    content: editor.value?.getHTML()
  })
}

function handleChange(index, key, val) {
  fields.value = fields.value.map((t, i) => {
    if (i === index) {
      return [key, val]
    } else {
      return t
    }
  })
}

function addField() {
  fields.value = [...fields.value, ['', '']]
}

function addImage() {
  const url = window.prompt('URL')

  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

function format(type: string) {
  if (type === 'bold') {
    editor.value.commands.toggleBold()
  }
  if (type === 'italic') {
    editor.value.commands.toggleItalic()
  }
  if (type === 'h1') {
    editor.value.commands.toggleHeading({ level: 1 })
  }

  if (type === 'h2') {
    editor.value.commands.toggleHeading({ level: 2 })
  }
  if (type === 'h3') {
    editor.value.commands.toggleHeading({ level: 3 })
  }
}
</script>
<template>
  <div :class="$style.headerControls">
    <v-btn variant="tonal" color="#5865f2" class="text-subtitle-1" @click="handleSave"
      >Publish</v-btn
    >
  </div>
  <v-text-field
    variant="underlined"
    label="New Article Title"
    :value="name"
    @input="(event) => (name = event.target.value)"
  />
  <h2>Meta</h2>
  <div :class="$style.inputs">
    <template v-for="([key, val], index) in fields" :key="index">
      <div :class="$style.inputRow">
        <v-text-field
          density="compact"
          variant="underlined"
          label="Key"
          :value="key"
          @input="(event) => handleChange(index, event.target.value, val)"
        />

        <v-text-field
          density="compact"
          variant="underlined"
          label="Value"
          :value="val"
          @input="(event) => handleChange(index, key, event.target.value)"
        />
      </div>
    </template>
    <v-btn variant="tonal" density="comfortable" class="text-subtitle-1" @click="addField"
      >Add field</v-btn
    >
  </div>
  <h2>Content</h2>
  <div :class="$style.controls">
    <EditorButton iconName="bold" :handleClick="() => format('bold')" />
    <EditorButton iconName="italic" :handleClick="() => format('italic')" />
    <EditorButton iconName="h1" :handleClick="() => format('h1')" />
    <EditorButton iconName="h2" :handleClick="() => format('h2')" />
    <EditorButton iconName="h3" :handleClick="() => format('h3')" />
    <EditorButton iconName="image" :handleClick="addImage" />
  </div>
  <editor-content :editor="editor" />
</template>

<style module>
.headerControls {
  display: flex;
  justify-content: flex-end;
}

.label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.editor {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-height: 200px;
}

.bold {
  font-weight: 600;
}

.controls {
  display: flex;
  gap: 6px;
  padding: 10px 0;
}

.inputRow {
  display: flex;
  gap: 16px;
  max-width: 600px;
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
