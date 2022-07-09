<script lang="ts">
import Vue from "vue";
import { SettingsGridModel } from "@/backend/model/settings-grid-model";

export default Vue.extend({
  name: "GridView",

  data() {
    return {
      columnCount: 0,
      rowCount: 0,
    };
  },
  mounted() {
    window.api.receive("update-grid-settings", (event, data) => {
      this.columnCount = data.columnCount;
      this.rowCount = data.rowCount;
    });
  },
});
</script>

<template>
  <v-main>
    <div style="height: 500px; width: 500px">{{ this.columnCount }}</div>
  </v-main>
</template>

<style scoped lang="sass">
*
  background-color: transparent

div
  border: 1px dotted white
</style>
