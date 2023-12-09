<script lang="ts" setup>
import { computed, ref } from 'vue'
import { getFromStorage } from '@/utils/persistentStorage'
import IconLogo from '@/components/icons/IconLogo.vue'

const open = ref(['Users'])
const currentFavorites = getFromStorage('favorites')
const favoritesState = ref<string[]>(currentFavorites ? JSON.parse(currentFavorites) : [])
const items = computed(() => [
  {
    title: 'Projects',
    icon: 'construction',
    items: favoritesState.value.map((projectName) => ({
      title: projectName,
      link: `/projects/${projectName}`
    })),
    active: true
  }
])
</script>

<template>
  <v-navigation-drawer>
    <v-list v-model:opened="open">
      <v-list-subheader>
        <div :class="$style.logo">
          <IconLogo />
        </div>
      </v-list-subheader>
      <v-list-group value="Users">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="dashboard"
            title="My Projects"
            color="grey-darken-2"
          >
          </v-list-item>
        </template>

        <v-list-item
          link
          v-for="({ title, link }, i) in items[0].items"
          :key="i"
          :title="title"
          :value="title"
          :to="link"
        ></v-list-item>
        <v-list-item title="Back to all projects" link to="/projects"></v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<style module>
.nav {
  margin-top: 60px;
  height: 100%;
  position: fixed;
  width: 300px;
}

.logo {
  padding-bottom: 2em;
  transform: scale(0.75) translateX(-25px);
}
</style>
