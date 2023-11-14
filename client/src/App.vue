<script setup lang="ts">
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { useGetUser } from '@/queries/get-user'

const router = useRouter()
const { data: user, isLoading } = useGetUser()
const { bio, name, avatar_url } = user.value || {}

console.log('user', user)

router.beforeEach(async (to) => {
  const code = Cookies.get('github-access-token')

  if (!code && to.name !== 'Login') {
    return { name: 'Login' }
  }
})
</script>

<template>
  <header>
    <h1 :class="$style.logo">Blog Crafter</h1>
    <div v-if="!isLoading">
      <v-avatar color="grey" size="50" rounded="50%">
        <v-img cover :src="avatar_url"></v-img>
      </v-avatar>
      {{ name }}
      {{ bio }}
    </div>
  </header>
  <main><RouterView /></main>
</template>

<style module>
header {
  line-height: 1.5;
  max-height: 100vh;
  padding: 2rem 2rem 2rem 2rem;
}

main {
  padding: 0 2rem 0 2rem;
}

.logo {
  color: #5865f2;
  font-weight: 700;
  font-size: 46px;
}
</style>
