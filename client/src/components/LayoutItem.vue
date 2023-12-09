<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useGetUser } from '@/queries/get-user'
import NavigationMenu from '@/components/NavigationMenu.vue'
import IconLogo from '@/components/icons/IconLogo.vue'

const router = useRouter()
const route = useRoute()
const { data: user } = useGetUser()

const handleLogout = () => {
  localStorage.removeItem(`github-access-token`)
  router.push({
    name: 'Login'
  })
}
</script>

<template>
  <header :class="$style.header">
    <div>
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
    </div>
  </header>
  <main :class="$style.main">
    <slot></slot>
  </main>

  <NavigationMenu v-if="route.path !== '/'" />
</template>

<style module>
.header {
  line-height: 1.5;
  height: 60px;
  padding: 1em 3em 1em 1em;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.main {
  padding: 0 1rem 0 1rem;
  margin-left: 160px;
  padding: 40px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.14902) 0px 10px 20px 0px;
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
