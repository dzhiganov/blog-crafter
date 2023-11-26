<script lang="ts" setup>
import { ref, computed, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useGetArticleContentQuery } from '@/queries/article-content'
import { useUpdateArticle } from '@/queries/articles'
import { useGetUser } from '@/queries/get-user'
import EditorItem from '@/components/EditorItem.vue'
import { getFromStorage } from '@/utils/persistentStorage'
import MetaFields from '@/components/MetaFields.vue'

const {
  params: { articleId, projectId }
} = useRoute()
const { data: user } = useGetUser()
const showNotification = inject<(message: string) => void>('showNotification')

const userLogin = computed(() => user.value?.login)
const enabled = computed(() => !!user.value?.login)
const editorComponent = ref<{ getHtml: () => string }>({ getHtml: () => '' })
const metaFieldsComponent = ref<{ getMetaData: () => Record<string, string> }>({
  getMetaData: () => ({})
})

const {
  data: articleContent,
  isLoading,
  isFetching
} = useGetArticleContentQuery(
  {
    user: userLogin,
    repo: String(projectId),
    branch: 'main',
    path: encodeURIComponent(String(articleId))
  },
  enabled
)

const { mutate: updateArticle } = useUpdateArticle({
  onSuccess: () => showNotification?.('Article was saved successfully'),
  onError: () => showNotification?.('Error while saving article')
})

function handleSave() {
  updateArticle({
    path: String(articleId),
    meta: metaFieldsComponent.value.getMetaData(),
    content: editorComponent.value?.getHtml(),
    user: userLogin.value,
    branch: getFromStorage(`${projectId}:branch`),
    repo: String(projectId)
  })
}
</script>
<template>
  <div :class="$style.wrapper">
    <div class="d-flex justify-end">
      <v-btn
        variant="tonal"
        color="#5865f2"
        class="text-subtitle-1"
        @click="handleSave"
        size="large"
        >Save</v-btn
      >
    </div>
    <v-skeleton-loader
      width="500"
      v-if="isLoading || isFetching"
      type="article"
    ></v-skeleton-loader>
    <div v-if="!isLoading || isFetching">
      <h2>Meta</h2>
      <MetaFields ref="metaFieldsComponent" />
    </div>

    <h2 v-if="!isLoading || !isFetching">Content</h2>
    <EditorItem
      v-if="!isLoading && !isFetching"
      ref="editorComponent"
      :initial-content="articleContent?.md ?? ''"
    />
  </div>
</template>
<style module>
.wrapper {
  max-width: 800px;
  margin: 0 auto;
}
</style>
