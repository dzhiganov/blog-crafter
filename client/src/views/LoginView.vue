<script setup lang="ts">
import { useGetAccessToken } from '@/queries/get-access-token'
import Cookies from 'js-cookie'
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const CLIENT_ID = '3770f00f3de023a8260b'

const router = useRouter()
const route = useRoute()
const { data: accessToken } = useGetAccessToken(route.query.code ? String(route.query.code) : '')

const openAuth = () => {
  window.location.assign(
    `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,admin:repo_hook,admin:org,admin:public_key,admin:org_hook,gist,notifications,user,project,delete_repo,write:packages,read:packages,delete:packages,admin:gpg_key,codespace,workflow`
  )
}

watch(accessToken, () => {
  console.log('accessToken.value', accessToken.value)
  Cookies.set('github-access-token', String(accessToken.value), { secure: true })
  router.replace('/dashboard')
})

onMounted(() => {
  if (Cookies.get('github-access-token')) {
    router.replace('/dashboard')
  }
})
</script>

<template>
  <div>
    <button @click="openAuth">Login</button>
  </div>
  <RouterView />
</template>

<style scoped></style>
