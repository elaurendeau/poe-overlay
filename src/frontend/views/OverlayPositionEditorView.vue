<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "OverlayPositionEditorView",
  data() {
    return {};
  },
});
</script>

<template>
  <v-container id="global-container" fluid>
    <v-container
      id="container"
      class="w-100 h-100"
      style="
        background-color: #00d4ff25;
        -webkit-app-region: drag;
        height: 500px;
      "
      fluid
    ></v-container>
  </v-container>
</template>

<style scoped lang="sass">
*
  padding: 0
  margin: 0
</style>
