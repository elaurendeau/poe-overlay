<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "SettingsScreenCaptureComponent",
  props: {
    programName: {
      type: String,
      default: "",
    },
    windowNameArray: {
      type: Array,
    },
  },
  methods: {
    programNameOnChange() {
      this.$emit("update:programName", this.localProgramName);
    },
    async refreshWindowNameArray() {
      console.log(`Front.ipc -> refresh-settings-window-array`);
      window.api.send("refresh-settings-window-array");
      this.windowNameRefreshDegree += 360;
    },
    windowNameListOnChange(value) {
      this.localProgramName = value;
      this.programNameOnChange();
    },
  },
  data() {
    return {
      localProgramName: this.programName,
      localWindowNameArray: this.windowNameArray,
      windowNameRefreshDegree: 0,
    };
  },
  watch: {},
  mounted() {
    window.api.receive("update-settings-window-list", (event, data) => {
      console.log(
        `Back.ipc -> update-settings-window-list '${JSON.stringify(data)}'`
      );

      this.localWindowNameArray = data;
      this.$forceUpdate;
    });
  },
});
</script>

<template>
  <v-container id="container">
    <v-row no-gutters class="w-100">
      <v-col>
        <v-subheader class="pl-0 pb-5">Game Window Name:</v-subheader>
        <v-row>
          <v-flex
            class="d-flex align-stretch"
            style="-webkit-app-region: no-drag"
          >
            <v-col cols="6">
              <v-text-field
                v-model="localProgramName"
                outlined
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-select
                :items="localWindowNameArray"
                @change="windowNameListOnChange"
                outlined
                hide-details
              ></v-select>
            </v-col>
            <v-col
              cols="1"
              justify-center
              class="d-flex align-stretch justify-end clicker"
              @click="refreshWindowNameArray"
            >
              <v-icon
                class="transition"
                v-bind:style="{
                  transform: `rotate(${windowNameRefreshDegree}deg)`,
                }"
                >mdi-refresh
              </v-icon>
            </v-col>
          </v-flex>
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

.transition
  transition: transform 0.5s ease-in-out
</style>
