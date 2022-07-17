<script lang="ts">
import Vue, { PropType } from "vue";
import { WindowSourcePropertiesModel } from "@/backend/model/window-source-properties-model";
export default Vue.extend({
  name: "SettingsScreenCaptureComponent",
  props: {
    programName: {
      type: String,
      default: "",
    },
    windowSourceArray: {
      type: Array as PropType<Array<WindowSourcePropertiesModel>>,
      default: () => [],
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
    async windowNameListOnChange(windowProperties) {
      this.localProgramName = windowProperties.programName;
      this.currentWindowSourceProperties = windowProperties;
      this.programNameOnChange();

      await this.updateVideoStream(windowProperties);
    },

    async updateVideoStream(windowProperties) {
      const htmlVideoElement = document.querySelector("video");
      if (htmlVideoElement) {
        console.log(`Front.ipc -> stream`);
        console.log(`--------------- `);
        const stream = await window.api.stream(
          "stream-full-window",
          windowProperties,
          htmlVideoElement
        );
      }
    },
  },
  data() {
    return {
      localProgramName: this.programName,
      localWindowArray: this.windowSourceArray,
      currentWindowSourceProperties: null as WindowSourcePropertiesModel | null,
      windowNameRefreshDegree: 0,
      localStream: null as MediaStream | null,
    };
  },
  watch: {
    currentWindowSourceProperties(newValue) {
      if (newValue) {
        this.updateVideoStream(newValue);
      }
    },
  },
  mounted() {
    window.api.receive("update-settings-window-list", (event, data) => {
      console.log(
        `SettingsScreenCapture -> Back.ipc -> update-settings-window-list '${data}'`
      );

      this.localWindowArray = data;

      if (!this.currentWindowSourceProperties && this.localProgramName) {
        const filteredWindowArray = this.localWindowArray?.filter(
          (windowSourceProperties: WindowSourcePropertiesModel) => {
            return windowSourceProperties.programName === this.localProgramName;
          }
        );

        if (filteredWindowArray.length === 1) {
          this.currentWindowSourceProperties = filteredWindowArray[0];
        }
      }
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
                @change="programNameOnChange"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-select
                item-text="programName"
                :items="localWindowArray"
                :key="localWindowArray"
                @change="windowNameListOnChange"
                outlined
                hide-details
                return-object
              >
              </v-select>
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
    <v-row>
      <v-col>
        <div class="w-100 h-100" style="height: 400px">
          <video id="stream" class="w-100 h-100" muted autoplay></video>
        </div>
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
