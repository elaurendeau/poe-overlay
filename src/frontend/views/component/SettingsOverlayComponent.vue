<script lang="ts">
import Vue, { PropType } from "vue";
import { OverlayModel } from "@/backend/model/overlay-model";
export default Vue.extend({
  name: "SettingsOverlayComponent",
  props: {
    programName: {
      type: String,
      default: "",
    },
    windowNameArray: {
      type: Array,
    },
    overlayArray: {
      type: Array as PropType<OverlayModel[]>,
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

    createNewOverlay() {
      this.localOverlayArray?.push({
        name: "new",
        captureX: 0,
        captureY: 0,
        captureXLength: 100,
        captureYLength: 100,

        positionX: 0,
        positionY: 0,
      });
    },
  },
  data() {
    return {
      localProgramName: this.programName,
      localWindowNameArray: this.windowNameArray,
      localOverlayArray: this.overlayArray,
      windowNameRefreshDegree: 0,
      overlayHeaderArray: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Position", value: "position" },
        { text: "Recording Position", value: "recording-position" },
      ],
    };
  },
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
        <v-subheader class="pl-0 pb-5">Name of program:</v-subheader>
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
              class="d-flex align-stretch justify-end"
              @click="refreshWindowNameArray"
            >
              <v-icon
                class="transition"
                v-bind:style="{
                  transform: `rotate(${windowNameRefreshDegree}deg)`,
                }"
                >mdi-refresh</v-icon
              >
            </v-col>
          </v-flex>
        </v-row>
      </v-col>
    </v-row>
    <v-row no-gutters class="w-100 mt-5">
      <v-col>
        <v-subheader class="pl-0 pb-5">Overlays:</v-subheader>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-icon @click="createNewOverlay">mdi-plus-circle-outline</v-icon>
      </v-col>
    </v-row>
    <v-row no-gutters class="w-100 mt-5">
      <v-data-table
        :headers="overlayHeaderArray"
        :items="this.localOverlayArray"
        hide-default-footer
        class="elevation-1 w-100"
      >
        <template v-slot:[`item.position`]="{ item }">
          <span>{{
            `(${item.positionX}, ${item.positionY}, ${
              item.positionX + item.captureXLength
            }, ${item.positionY + item.captureYLength})`
          }}</span>
        </template>

        <template v-slot:[`item.recording-position`]="{ item }">
          <span>{{
            `(${item.captureX}, ${item.captureY}, ${
              item.captureX + item.captureXLength
            }, ${item.captureY + item.captureYLength})`
          }}</span>
        </template>
      </v-data-table></v-row
    >
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
