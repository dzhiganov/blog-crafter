<script setup lang="ts">
import Cookies from 'js-cookie'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const CLIENT_ID = '3770f00f3de023a8260b'

const router = useRouter()
const route = useRoute()

const openAuth = () => {
  window.location.assign(
    `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,admin:repo_hook,admin:org,admin:public_key,admin:org_hook,gist,notifications,user,project,delete_repo,write:packages,read:packages,delete:packages,admin:gpg_key,codespace,workflow`
  )
}

onMounted(() => {
  if (route.query.code) {
    Cookies.set('github-api-code', String(route.query.code), { secure: true })
  }

  if (Cookies.get('github-api-code')) {
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
