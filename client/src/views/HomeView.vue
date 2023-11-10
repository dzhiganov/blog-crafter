<script setup lang="ts">
import { useGetArticlesQuery } from '@/queries/articles'
import { useRouter } from 'vue-router'

const router = useRouter()
const { data: articles } = useGetArticlesQuery()

const openArticle = (path: string) => {
  router.push(`articles/${encodeURIComponent(path)}`)
}
</script>

<template>
  <ul>
    <li v-for="{ name, parent } in articles" :key="name" @click="openArticle(parent)">
      {{ `${parent}/${name}` }}
    </li>
  </ul>
</template>
