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
  },
  methods: {
    columnCountOnChange() {
      this.$emit("update:columnCount", this.localColumnCount);
    },
    rowCountOnChange() {
      this.$emit("update:rowCount", this.localRowCount);
    },
  },
  data() {
    return {
      localRowCount: this.rowCount,
      localColumnCount: this.columnCount,
    };
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
          max="20"
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
          max="20"
          min="1"
          :thumb-size="24"
          thumb-label="always"
          dark
        ></v-slider>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="sass"></style>
