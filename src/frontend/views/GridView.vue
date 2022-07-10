<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "GridView",
  data() {
    return {
      columnCount: 0,
      rowCount: 0,
      displayCenterLine: true,
      colorCenterLines: "border: 2px solid #FF000039",
      colorGrid: "border: 1px dotted #FF000039",
    };
  },
  mounted() {
    window.api.receive("update-grid-settings", (event, data) => {
      console.log(`Back.ipc -> update-grid-settings '${JSON.stringify(data)}'`);
      this.columnCount = data["columnCount"];
      this.rowCount = data["rowCount"];
      this.displayCenterLine = data["displayCenterLines"];

      this.colorCenterLines = `border: 2px solid ${data["color"]}`;
      this.colorGrid = `border: 1px dotted ${data["color"]}`;

      this.$forceUpdate;
    });
  },
});
</script>

<template>
  <v-container id="global-container" fluid>
    <v-container id="container" fluid>
      <div
        v-if="displayCenterLine"
        class="vertical-line"
        :style="colorCenterLines"
      ></div>
      <div
        v-if="displayCenterLine"
        class="horizontal-line"
        :style="colorCenterLines"
      ></div>
      <v-row :key="row" v-for="row in rowCount" no-gutters>
        <v-col :key="col" v-for="col in columnCount">
          <div class="box h-100" :style="colorGrid"></div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped lang="sass">
*
  padding: 0
  margin: 0
#global-container
  width: 100vw
  height: 100vh
  display: flex
  align-items: center
  justify-content: center
#container
  width: 99.9vw
  height: 99.9vh
  display: flex
  flex-direction: column
.vertical-line
    position: absolute
    width: 0px
    height: 100%
    left: calc(50% - 2px)
.horizontal-line
  position: absolute
  width: 100%
  height: 0px
  top: calc(50% - 2px)
</style>
