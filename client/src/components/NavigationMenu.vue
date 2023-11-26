<template>
  <nav :class="$style.nav" permanent width="300">
    <v-list>
      <v-list-item link title="Projects" to="/projects" />
    </v-list>
  </nav>
</template>

<style module>
.nav {
  margin-top: 60px;
  height: 100%;
  position: fixed;
  width: 300px;
  border-right: 1px solid #ccc;
}
</style>
