<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "SettingsGridComponent",
  props: {
    rowCount: {
      type: Number,
      default: 5,
    },
    columnCount: {
      type: Number,
      default: 5,
    },
    displayCenterLines: {
      type: Boolean,
      default: true,
    },
    gridColor: {
      type: String,
      default: "#FF000039",
    },
  },
  methods: {
    columnCountOnChange() {
      this.$emit("update:columnCount", this.localColumnCount);
    },
    rowCountOnChange() {
      this.$emit("update:rowCount", this.localRowCount);
    },
    localDisplayCenterLinesOnChange() {
      console.log(this.localColor);
      this.$emit("update:displayCenterLines", this.localDisplayCenterLines);
    },
  },
  data() {
    return {
      localRowCount: this.rowCount,
      localColumnCount: this.columnCount,
      localColor: this.gridColor,
      localDisplayCenterLines: this.displayCenterLines,
    };
  },
  watch: {
    localColor(newValue) {
      this.$emit("update:gridColor", this.localColor);
    },
  },
});
</script>

<template>
  <v-container style="margin: 25px">
    <v-row class="w-100">
      <v-col>
        <v-subheader class="pl-0 pb-5">Number of column:</v-subheader>
        <v-slider
          v-model="localColumnCount"
          @change="columnCountOnChange"
          max="200"
          min="1"
          :thumb-size="24"
          thumb-label="always"
          dark
        ></v-slider>
      </v-col>
    </v-row>
    <v-row class="w-100">
      <v-col>
        <v-subheader class="pl-0 pb-5">Number of row:</v-subheader>
        <v-slider
          v-model="localRowCount"
          @change="rowCountOnChange"
          max="200"
          min="1"
          :thumb-size="24"
          thumb-label="always"
          dark
        ></v-slider>
      </v-col>
    </v-row>
    <v-row class="w-100">
      <v-col>
        <v-checkbox
          v-model="localDisplayCenterLines"
          label="Add center lines"
          @change="localDisplayCenterLinesOnChange"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-row class="w-100">
      <v-col>
        <v-subheader class="pl-0 pb-5">Grid color:</v-subheader>
        <v-color-picker
          dot-size="15"
          hide-canvas
          hide-mode-switch
          mode="hexa"
          swatches-max-height="100"
          style="background-color: transparent"
          v-model="localColor"
        ></v-color-picker>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="sass"></style>
