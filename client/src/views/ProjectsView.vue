<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGetRepos } from '@/queries/get-repos'
import { useGetUser } from '@/queries/get-user'
import { computed } from 'vue'

const router = useRouter()
const { data: user, isLoading: isUserLoading } = useGetUser()

const userLogin = computed(() => user.value?.login)
const enabled = computed(() => Boolean(user.value?.login))

const { data: repos, isFetching, isLoading } = useGetRepos({ user: userLogin }, enabled)
</script>

<template>
  <div>
    <h3 class="text-h5 mb-2 mt-8">All repositories</h3>
    <v-skeleton-loader
      width="500"
      v-if="isLoading || isFetching"
      type="list-item-three-line"
    ></v-skeleton-loader>
    <v-list v-else>
      <v-list-item v-for="{ name, html_url } in repos" :key="name" class="ml-0 pl-0">
        <v-card class="my-4 ml-2" max-width="400" elevation="4">
          <v-card-title>
            <router-link :to="`/projects/${name}`">{{ name }}</router-link>
          </v-card-title>
          <v-card-text>
            <a :href="html_url">
              <v-icon icon="open_in_new" size="16" />
              Open on GitHub</a
            >
          </v-card-text>
        </v-card>
      </v-list-item>
    </v-list>
  </div>
</template>
