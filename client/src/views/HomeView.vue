<script setup lang="ts">
import { useGetArticlesQuery, useCreateNewArticle } from '@/queries/articles'
import { useRouter } from 'vue-router'

const router = useRouter()
const { data: articles } = useGetArticlesQuery()

const openArticle = (path: string) => {
  router.push(`articles/${encodeURIComponent(path)}`)
}

const createNewArticle = () => {
  router.push(`articles/new`)
}
</script>

<template>
  <div>
    <button @click="createNewArticle">New article</button>
  </div>
  <ul>
    <li v-for="{ name, parent } in articles" :key="name" @click="openArticle(parent)">
      {{ `${parent}/${name}` }}
    </li>
  </ul>
</template>
