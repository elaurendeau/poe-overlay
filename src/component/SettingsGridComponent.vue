<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "SettingsGridComponent",
  data() {
    return {
      rowCount: 5,
      columnCount: 5,
    };
  },
});
</script>

<template>
  <v-main>
    <v-slider v-model="max" label="Max characters"> </v-slider>
  </v-main>
</template>

<style scoped lang="sass"></style>
