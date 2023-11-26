<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import Cookies from 'js-cookie'
import { useGetUser } from '@/queries/get-user'
import NavigationMenu from '@/components/NavigationMenu.vue'

const router = useRouter()
const route = useRoute()
const { data: user } = useGetUser()

const handleLogout = () => {
  Cookies.remove(`github-access-token`)
  router.push({
    name: 'Login'
  })
}
</script>

<template>
  <header>
    <h1 :class="$style.logo">🛠️ Blog Crafter</h1>
    <v-container>
      <v-row justify="end">
        <v-menu min-width="200px" rounded>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar color="brown" size="large">
                <v-img cover :src="user?.avatar_url" />
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-btn class="text-none" variant="text" @click="handleLogout">Log out</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-row>
    </v-container>
  </header>
  <main>
    <slot></slot>
  </main>

  <NavigationMenu v-if="route.path !== '/'" />
</template>

<style module>
header {
  line-height: 1.5;
  height: 60px;
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  align-items: center;
  margin-bottom: 1rem;
  position: fixed;
  top: 0;
  z-index: 1;
  background-color: #fff;
  left: 0;
  right: 0;
}

main {
  padding: 0 1rem 0 1rem;
  margin-left: 300px;
  margin-top: 60px;
  padding: 22px;
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
