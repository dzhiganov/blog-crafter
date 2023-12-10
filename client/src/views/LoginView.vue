<script setup lang="ts">
import { useGetAccessToken } from '@/queries/get-access-token'
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IconGithub from '@/components/icons/IconGithub.vue'
import IconLogo from '@/components/icons/IconLogo.vue'

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
  localStorage.setItem('github-access-token', String(accessToken.value))
  router.replace('/projects')
})

onMounted(() => {
  if (localStorage.getItem('github-access-token')) {
    router.replace('/projects')
  }
})
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <IconLogo />
      Blog Crafter
    </div>
    <div :class="$style.content">
      <div :class="$style.textContent">
        <div :class="$style.title">Craft Your Ideas,<br />Shape Your Story</div>
        <div :class="$style.description">
          With a user-friendly WYSIWYG editor, effortlessly create and edit markdown files, then
          effortlessly publish your stories on GitHub
        </div>
        <div :class="$style.loginContainer">
          <v-btn
            class="text-h6 mb-4"
            @click="openAuth"
            variant="flat"
            size="large"
            color="blue-grey-darken-4"
          >
            <IconGithub />
            <span class="ml-2">Login with GitHub</span>
          </v-btn>
        </div>
        <router-link to="/about">What is a Blog Crafter?</router-link>
      </div>

      <div :class="$style.imageContent">
        <img src="/dashboard-image.png" />
      </div>
    </div>

    <RouterView />
  </div>
</template>

<style module>
.wrapper {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
}
.content {
  display: flex;
  margin-top: 5em;
  justify-content: space-between;
}

.textContent {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.title {
  color: #1f1f1f;
  font-weight: 800;
  font-size: 3.2em;
  line-height: normal;
}

.description {
  max-width: 300px;
}
.loginContainer {
  display: flex;
  flex-direction: column;
  width: fit-content;
  align-items: flex-start;
}
.logo {
  color: #5865f2;
  font-weight: 700;
  font-size: 42px;
}

.header {
  padding-top: 1em;
  font-size: 20px;
  display: flex;
  align-items: center;
  font-weight: 600;
  gap: 8px;
}

.imageContent {
  flex-shrink: 0;
  max-width: 800px;
  box-shadow: rgba(0, 0, 0, 0.14902) 0px 10px 20px 0px;
}
</style>
