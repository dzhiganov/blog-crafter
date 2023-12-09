<script setup lang="ts">
import { useGetRepos } from '@/queries/get-repos'
import { useGetUser } from '@/queries/get-user'
import { computed, ref } from 'vue'
import LayoutItem from '@/components/LayoutItem.vue'
import { getFromStorage, setIntoStorage } from '@/utils/persistentStorage'

const { data: user } = useGetUser()
const currentFavorites = getFromStorage('favorites')

const search = ref('')
const favoritesState = ref(new Set(currentFavorites ? JSON.parse(currentFavorites) : []))

const userLogin = computed(() => user.value?.login)
const enabled = computed(() => Boolean(user.value?.login))

const { data: repos, isFetching, isLoading } = useGetRepos({ user: userLogin }, enabled)

const filteredRepos = computed(() => {
  const projects: { name: string; html_url: string }[] = []
  const favorites: { name: string; html_url: string }[] = []

  ;(repos.value || []).forEach((t) => {
    if (search.value && !t.name.toLowerCase().startsWith(search.value.toLowerCase())) {
      return
    }

    if (favoritesState.value.has(t.name)) {
      favorites.push(t)
    } else {
      projects.push(t)
    }
  })

  return {
    projects,
    favorites
  }
})

const switchFavorite = (projectId: string) => {
  try {
    const currentFavorites = getFromStorage('favorites')
    const newFavorites: string[] = currentFavorites ? JSON.parse(currentFavorites) : []
    if (!newFavorites.includes(projectId)) {
      newFavorites.push(projectId)
      setIntoStorage('favorites', newFavorites)
      favoritesState.value.add(projectId)
    } else {
      setIntoStorage(
        'favorites',
        newFavorites.filter((t) => t !== projectId)
      )
      favoritesState.value.delete(projectId)
    }
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <LayoutItem>
    <div>
      <div :class="$style.controls">
        <v-text-field
          v-model="search"
          density="compact"
          variant="underlined"
          label="Search projects"
        />
      </div>
      <v-skeleton-loader
        width="500"
        v-if="isLoading || isFetching"
        type="list-item-three-line"
        class="bg-white"
      ></v-skeleton-loader>
      <div v-else>
        <div>
          <h3 class="text-h4 mt-8 mb-4">My projects</h3>
          <v-list class="bg-white">
            <v-list-item
              v-for="{ name, html_url } in filteredRepos.favorites"
              :key="name"
              class="ml-0 pl-0 bg-white"
            >
              <v-card class="my-4 ml-2" max-width="400" elevation="4">
                <v-card-title class="d-flex justify-space-between">
                  <router-link :to="`/projects/${name}`">{{ name }}</router-link>
                  <v-btn @click="switchFavorite(name)" variant="text" class="text-none">
                    Delete
                  </v-btn>
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
        <div>
          <h3 class="text-h4 mt-8 mb-4">Projects</h3>
          <v-list class="bg-white">
            <v-list-item
              v-for="{ name, html_url } in filteredRepos.projects"
              :key="name"
              class="ml-0 pl-0 bg-white"
            >
              <v-card class="my-4 ml-2" max-width="400" elevation="4">
                <v-card-title class="d-flex justify-space-between">
                  <router-link :to="`/projects/${name}`">{{ name }}</router-link>
                  <v-btn @click="switchFavorite(name)" variant="text" class="text-none">
                    + Add
                  </v-btn>
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
      </div>
    </div>
  </LayoutItem>
</template>

<style module>
.controls {
  max-width: 400px;
}
</style>
