<script setup lang="ts">
import { useGetAccessToken } from '@/queries/get-access-token'
import Cookies from 'js-cookie'
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IconGithub from '@/components/icons/IconGithub.vue'

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
  Cookies.set('github-access-token', String(accessToken.value), { secure: true })
  router.replace('/projects')
})

onMounted(() => {
  if (Cookies.get('github-access-token')) {
    router.replace('/projects')
  }
})
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.loginContainer">
      <h1 :class="$style.logo">🛠️ Blog Crafter</h1>
      <v-btn class="text-h6 mb-4" @click="openAuth" variant="tonal" size="large">
        <IconGithub />
        <span class="ml-2">Login with GitHub</span>
      </v-btn>
    </div>
  </div>
  <RouterView />
</template>

<style module>
.container {
  display: flex;
  width: 100%;
  justify-content: center;
  height: 100vh;
}

.loginContainer {
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin-top: 200px;
}
.logo {
  color: #5865f2;
  font-weight: 700;
  font-size: 42px;
}
</style>
