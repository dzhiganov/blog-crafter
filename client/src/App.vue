<script setup lang="ts">
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { useGetUser } from '@/queries/get-user'

const router = useRouter()
const { data: user, isLoading } = useGetUser()

router.beforeEach(async (to) => {
  const code = Cookies.get('github-access-token')

  if (!code && to.name !== 'Login') {
    return { name: 'Login' }
  }
})
</script>

<template>
  <header>
    <div>
      <h1>
        <router-link :class="$style.logo" to="/">Blog Crafter</router-link>
      </h1>
    </div>
    <div v-if="!isLoading" :class="$style.userInfo">
      <v-avatar color="grey" size="30" rounded="50%">
        <v-img cover :src="user.avatar_url"></v-img>
      </v-avatar>
      <div>
        <span :class="$style.username"> {{ user.name }}</span>
      </div>
    </div>
  </header>
  <main><RouterView /></main>
</template>

<style module>
header {
  line-height: 1.5;
  max-height: 100vh;
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  align-items: center;
  margin-bottom: 1rem;
}

main {
  padding: 0 1rem 0 1rem;
}

.logo {
  color: #5865f2;
  font-weight: 700;
  font-size: 22px;
}

.userInfo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-weight: 500;
}
</style>
