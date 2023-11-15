<script setup lang="ts">
import { useGetArticlesQuery } from '@/queries/articles'
import { useRouter } from 'vue-router'

const router = useRouter()
const { data: articles, isFetching, isLoading } = useGetArticlesQuery()

const createNewArticle = () => {
  router.push(`articles/new`)
}
</script>

<template>
  <div>
    <v-btn variant="tonal" color="#5865f2" class="text-subtitle-1" @click="createNewArticle"
      >New article</v-btn
    >
  </div>
  <div>
    <v-skeleton-loader
      width="500"
      v-if="isLoading || isFetching"
      type="list-item-three-line"
    ></v-skeleton-loader>
    <v-list v-else>
      <v-list-item v-for="{ parent } in articles" :key="parent">
        <a :href="`/articles/${encodeURIComponent(parent)}`"> {{ parent }}</a>
      </v-list-item>
    </v-list>
  </div>
</template>
