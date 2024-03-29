<script lang="ts" setup>
import { computed, ref } from 'vue'
import { getFromStorage } from '@/utils/persistentStorage'
import IconLogoDark from '@/components/icons/IconLogoDark.vue'

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
  <v-navigation-drawer theme="dark">
    <v-list v-model:opened="open">
      <v-list-subheader>
        <div class="logo">
          <IconLogoDark />
        </div>
      </v-list-subheader>
      <v-list-group value="Users">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" color="grey-darken-2">
            <div class="menuItem">
              <span class="menuItemIcon">
                <svg
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  stroke-linejoin="round"
                  stroke-miterlimit="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    d="m11.6 11c0-.552-.448-1-1-1-1.655 0-4.945 0-6.6 0-.552 0-1 .448-1 1v9c0 .552.448 1 1 1h6.6c.552 0 1-.448 1-1 0-2.092 0-6.908 0-9zm9.4 6c0-.552-.448-1-1-1h-6c-.538 0-1 .477-1 1v3c0 .552.448 1 1 1h6c.552 0 1-.448 1-1zm-1.5.5v2h-5v-2zm-9.4-6v8h-5.6v-8zm10.9-7.5c0-.552-.448-1-1-1-1.537 0-4.463 0-6 0-.552 0-1 .448-1 1v9.6c0 .552.448 1 1 1h6c.552 0 1-.448 1-1 0-2.194 0-7.406 0-9.6zm-1.5.5v8.6h-5v-8.6zm-7.9-.5c0-.552-.448-1-1-1-1.655 0-4.945 0-6.6 0-.552 0-1 .448-1 1v3.6c0 .552.448 1 1 1h6.6c.552 0 1-.448 1-1 0-1.017 0-2.583 0-3.6zm-1.5.5v2.6h-5.6v-2.6z"
                    fill-rule="nonzero"
                  />
                </svg>
              </span>
              My Projects
            </div>
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

<style scoped>
.logo {
  padding-top: 0.5em;
  padding-bottom: 2em;
}

.menuItemIcon {
  display: inline-block;
  width: 20px;
  height: 20px;
}

.menuItemIcon > svg {
  width: 100%;
  height: 100%;
}

.menuItem {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 500;
}
</style>
