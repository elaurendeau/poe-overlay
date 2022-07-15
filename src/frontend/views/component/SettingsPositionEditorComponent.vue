<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "SettingsPositionEditorComponent",
  props: {
    captureColorEditor: {
      type: String,
      default: "#00F8FF38",
    },
    displayColorEditor: {
      type: String,
      default: "#8300FF38",
    },
  },
  methods: {},
  data() {
    return {
      localCaptureColorEditor: this.captureColorEditor,
      localDisplayColorEditor: this.displayColorEditor,
    };
  },
  watch: {
    localCaptureColorEditor(newValue) {
      this.$emit("update:captureColorEditor", newValue);
    },

    localDisplayColorEditor(newValue) {
      this.$emit("update:displayColorEditor", newValue);
    },
  },
});
</script>

<template>
  <v-container id="container">
    <v-row class="w-100">
      <v-col>
        <v-subheader class="pl-0 pb-5"
          >Capture Position Tool Color:</v-subheader
        >
        <v-color-picker
          dot-size="15"
          hide-canvas
          hide-mode-switch
          mode="hexa"
          swatches-max-height="100"
          style="background-color: transparent"
          v-model="localCaptureColorEditor"
        ></v-color-picker>
      </v-col>
    </v-row>
    <v-row class="w-100">
      <v-col>
        <v-subheader class="pl-0 pb-5"
          >Display Position Tool Color:</v-subheader
        >
        <v-color-picker
          dot-size="15"
          hide-canvas
          hide-mode-switch
          mode="hexa"
          swatches-max-height="100"
          style="background-color: transparent"
          v-model="localDisplayColorEditor"
        ></v-color-picker>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="sass">
*
  padding: 0
  margin: 0

#container
  padding: 25px
</style>
