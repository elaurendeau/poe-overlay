<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "SettingsOverlayComponent",
  props: {
    programName: {
      type: String,
      default: "",
    },
  },
  methods: {
    programNameOnChange() {
      this.$emit("update:programName", this.localProgramName);
    },
  },
  data() {
    return {
      localProgramName: this.programName,
    };
  },
  computed: {
    getWindowList() {
      return ["test1", "test2"];
    },
  },
});
</script>

<template>
  <v-container id="container">
    <v-row class="w-100">
      <v-col>
        <v-subheader class="pl-0 pb-5">Name of program:</v-subheader>
        <v-row>
          <v-col>
            <v-text-field
              v-model="localProgramName"
              outlined
              clearable
              @change="programNameOnChange"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select :items="getWindowList" outlined></v-select>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="sass">
*
  margin: 0
  padding: 0
#container
  padding: 25px
</style>
