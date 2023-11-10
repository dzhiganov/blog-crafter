<script lang="ts" setup>
import { ref, watch } from 'vue'
import { marked } from 'marked'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useRoute } from 'vue-router'
import { useGetArticleContentQuery } from '@/queries/article-content'
import { useUpdateArticle } from '@/queries/articles'

const route = useRoute()
const editor = useEditor({
  content: '',
  extensions: [StarterKit, Image.configure({ inline: true })]
})
const fields = ref({})

const { data: articleContent, isLoading } = useGetArticleContentQuery(
  encodeURIComponent(String(route.params.id))
)

const { mutate: updateArticle } = useUpdateArticle()

watch(articleContent, () => {
  if (articleContent.value) {
    const html = marked.parse(articleContent.value.content)

    editor.value?.commands.setContent(html)
    fields.value = articleContent.value.meta
  }
})

function handleSave() {
  updateArticle({
    path: route.params.id,
    meta: fields.value,
    content: editor.value?.getHTML()
  })
}
</script>
<template>
  <div>
    <button @click="handleSave">Save</button>
  </div>
  <h2 v-if="!isLoading">Meta</h2>
  <div :class="$style.inputs">
    <template v-for="[key, val] in Object.entries(fields)" :key="key">
      <label :for="key" :class="$style.label">{{ key }}</label>
      <input :id="key" :value="val" />
    </template>
  </div>
  <h2 v-if="!isLoading">Content</h2>
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
</style>
