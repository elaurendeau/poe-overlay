<template>
  <v-app style="background-color: transparent">
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="sass">
.w-100
  width: 100%

.h-100
  height: 100%

.clicker
  cursor: pointer
</style>
