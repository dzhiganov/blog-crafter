<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCreateNewArticle } from '@/queries/articles'
import { useGetUser } from '@/queries/get-user'
import { getFromStorage } from '@/utils/persistentStorage'
import EditorItem from '@/components/EditorItem.vue'
import MetaFields from '@/components/MetaFields.vue'

const { data: user } = useGetUser()
const userLogin = computed(() => user.value?.login)
const editorComponent = ref<{ getHtml: () => string }>({ getHtml: () => '' })
const metaFieldsComponent = ref<{ getMetaData: () => Record<string, string> }>({
  getMetaData: () => ({})
})

const route = useRoute()
const {
  params: { projectId }
} = route

const name = ref('')

const { mutate: createNewArticle } = useCreateNewArticle()

function handleSave() {
  createNewArticle({
    name: name.value,
    path: getFromStorage(`${projectId}:path-to-content`),
    meta: metaFieldsComponent.value.getMetaData(),
    content: editorComponent.value.getHtml(),
    user: userLogin.value,
    branch: getFromStorage(`${projectId}:branch`),
    repo: projectId
  })
}
</script>
<template>
  <div :class="$style.headerControls">
    <v-btn variant="tonal" color="#5865f2" class="text-subtitle-1" @click="handleSave"
      >Publish</v-btn
    >
  </div>
  <v-text-field variant="underlined" label="New Article Title" v-model="name" />
  <h2>Meta</h2>
  <MetaFields ref="metaFieldsComponent" />
  <h2>Content</h2>
  <EditorItem ref="editorComponent" />
</template>

<style module>
.headerControls {
  display: flex;
  justify-content: flex-end;
}
</style>
