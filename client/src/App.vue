<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, provide } from 'vue'

const router = useRouter()
const notificationMessage = ref('')
const notificationIsOpen = ref(false)

const showNotification = (message: string) => {
  notificationMessage.value = message
  notificationIsOpen.value = true
}

provide('showNotification', showNotification)

router.beforeEach(async (to) => {
  const code = localStorage.getItem('github-access-token')

  if (!code && !['Login', 'About'].includes(String(to.name))) {
    return { name: 'Login' }
  }
})

const closeNotification = () => {
  notificationMessage.value = ''
  notificationIsOpen.value = false
}
</script>

<template>
  <v-app>
    <RouterView />
    <v-snackbar v-model="notificationIsOpen" :timeout="5000" color="white">
      {{ notificationMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="closeNotification">
          <v-icon icon="close" />
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
