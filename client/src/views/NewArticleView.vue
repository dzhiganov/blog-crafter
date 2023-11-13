<script lang="ts" setup>
import { ref, watch, useCssModule } from 'vue'
import { marked } from 'marked'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useRoute } from 'vue-router'
import { useCreateNewArticle } from '@/queries/articles'
import IconImage from '@/components/icons/IconImage.vue'
import EditorButton from '@/components/EditorButton.vue'

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
    Image.configure({ inline: true })
  ],
  editorProps: {
    attributes: {
      class: cssModule.editor
    }
  }
})
const fields = ref([])
const name = ref('')

const { mutate: createNewArticle } = useCreateNewArticle()

function handleSave() {
  const meta = {}

  fields.value.forEach(([k, v]) => (meta[k] = v))

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
  fields.value = [...fields.value, []]
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
  <div>
    <button @click="handleSave">Save</button>
  </div>
  <input :value="name" @input="(event) => (name = event.target.value)" />
  <h2>Meta</h2>
  <div :class="$style.inputs">
    <template v-for="([key, val], index) in fields" :key="index">
      <input :value="key" @input="(event) => handleChange(index, event.target.value, val)" />
      <input :value="val" @input="(event) => handleChange(index, key, event.target.value)" />
    </template>
    <button @click="addField">New field</button>
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
.inputs {
  display: grid;
  grid-template-columns: 100px 500px;
  grid-row-gap: 0.75em;
}

.label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.editor {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.bold {
  font-weight: 600;
}

.controls {
  display: flex;
  gap: 4px;
  padding: 10px 0;
}
</style>
