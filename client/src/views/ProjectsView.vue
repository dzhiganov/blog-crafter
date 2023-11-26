<script setup lang="ts">
import { useGetRepos } from '@/queries/get-repos'
import { useGetUser } from '@/queries/get-user'
import { computed, ref } from 'vue'
import LayoutItem from '@/components/LayoutItem.vue'
const { data: user } = useGetUser()

const search = ref('')

const userLogin = computed(() => user.value?.login)
const enabled = computed(() => Boolean(user.value?.login))

const { data: repos, isFetching, isLoading } = useGetRepos({ user: userLogin }, enabled)

const filteredRepos = computed(() => {
  return search.value
    ? (repos.value || []).filter(({ name }) =>
        name.toLowerCase().startsWith(search.value.toLowerCase())
      )
    : repos.value
})
</script>

<template>
  <LayoutItem>
    <div>
      <h3 class="text-h4 mt-8 mb-4">All projects</h3>
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
      ></v-skeleton-loader>
      <v-list v-else>
        <v-list-item v-for="{ name, html_url } in filteredRepos" :key="name" class="ml-0 pl-0">
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
  </LayoutItem>
</template>

<style module>
.controls {
  max-width: 400px;
}
</style>
