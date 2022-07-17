<script lang="ts">
import Vue, { PropType } from "vue";
import { WindowSourcePropertiesModel } from "@/backend/model/window-source-properties-model";
export default Vue.extend({
  name: "SettingsScreenCaptureComponent",
  props: {
    displayWindowName: {
      type: String,
      default: "",
    },
    captureWindowName: {
      type: String,
      default: "",
    },
    windowSourceArray: {
      type: Array as PropType<Array<WindowSourcePropertiesModel>>,
      default: () => [],
    },
  },
  methods: {
    changeDisplayWindowName() {
      console.log(`changeCaptureWindowName ${this.localDisplayWindowName}`);

      this.$emit("update:displayWindowName", this.localDisplayWindowName);
    },
    changeCaptureWindowName() {
      console.log(`changeCaptureWindowName ${this.localCaptureWindowName}`);

      this.$emit("update:captureWindowName", this.localCaptureWindowName);
    },
    async refreshWindowNameArray() {
      console.log(`Front.ipc -> refresh-settings-window-array`);
      window.api.send("refresh-settings-window-array");
      this.windowNameRefreshDegree += 360;
    },
    async changeDisplayWindowArray(windowProperties) {
      console.log(`changeDisplayWindowArray ${windowProperties}`);

      this.localDisplayWindowName = windowProperties.programName;
      this.currentDisplayWindowProperties = windowProperties;
      this.changeDisplayWindowName();

      await this.updateVideoStream(
        windowProperties,
        "video[id='stream-display']"
      );
    },

    async changeCaptureWindowArray(windowProperties) {
      console.log(`changeCaptureWindowArray ${windowProperties}`);

      this.localCaptureWindowName = windowProperties.programName;
      this.currentCaptureWindowProperties = windowProperties;
      this.changeCaptureWindowName();

      await this.updateVideoStream(
        windowProperties,
        "video[id='stream-capture']"
      );
    },

    async updateVideoStream(windowProperties, filter) {
      console.log(`updateVideoStream ${windowProperties} ${filter}`);

      const htmlVideoElement = document.querySelector(filter);
      if (htmlVideoElement) {
        const stream = await window.api.stream(
          "stream-full-window",
          windowProperties,
          htmlVideoElement
        );
      }
    },
    updateCurrentWindowProperties(
      localWindowName
    ): WindowSourcePropertiesModel {
      console.log(`updateVideoStream ${localWindowName}`);
      if (localWindowName) {
        console.log("Im in");
        console.log(`array: ${JSON.stringify(this.localWindowArray)}`);
        const filteredWindowArray = this.localWindowArray?.filter(
          (windowSourceProperties: WindowSourcePropertiesModel) => {
            console.log(
              `Comparing ${
                windowSourceProperties.programName
              } with ${localWindowName} result ${
                windowSourceProperties.programName === localWindowName
              }`
            );
            return windowSourceProperties.programName === localWindowName;
          }
        );

        console.log(`Filtered list ${JSON.stringify(filteredWindowArray)}`);
        if (filteredWindowArray.length === 1) {
          return filteredWindowArray[0];
        }
      }
      throw new Error("Unable to find a window match");
    },
  },
  data() {
    return {
      localDisplayWindowName: this.displayWindowName,
      localCaptureWindowName: this.captureWindowName,
      localWindowArray: this.windowSourceArray,
      currentDisplayWindowProperties:
        null as WindowSourcePropertiesModel | null,
      currentCaptureWindowProperties:
        null as WindowSourcePropertiesModel | null,
      windowNameRefreshDegree: 0,
      localStream: null as MediaStream | null,
    };
  },
  watch: {
    currentDisplayWindowProperties(newValue) {
      console.log(`currentDisplayWindowProperties ${newValue}`);
      if (newValue) {
        this.updateVideoStream(newValue, "video[id='stream-display']");
      }
    },

    currentCaptureWindowProperties(newValue) {
      console.log(`currentCaptureWindowProperties ${newValue}`);
      if (newValue) {
        this.updateVideoStream(newValue, "video[id='stream-capture']");
      }
    },
  },
  mounted() {
    window.api.receive("update-settings-window-list", (event, data) => {
      console.log(
        `SettingsScreenCapture -> Back.ipc -> update-settings-window-list '${data}'`
      );

      this.localWindowArray = data;

      if (!this.currentDisplayWindowProperties) {
        this.currentDisplayWindowProperties =
          this.updateCurrentWindowProperties(this.localDisplayWindowName);
      }

      if (!this.currentCaptureWindowProperties) {
        this.currentCaptureWindowProperties =
          this.updateCurrentWindowProperties(this.localCaptureWindowName);
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
        <v-subheader class="pl-0 pb-5">Window to display overlay:</v-subheader>
        <v-row>
          <v-flex
            class="d-flex align-stretch"
            style="-webkit-app-region: no-drag"
          >
            <v-col cols="6">
              <v-text-field
                v-model="localDisplayWindowName"
                outlined
                clearable
                hide-details
                @change="changeDisplayWindowName"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-select
                item-text="programName"
                :items="localWindowArray"
                @change="changeDisplayWindowArray"
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
          <video id="stream-display" class="w-100 h-100" muted autoplay></video>
        </div>
      </v-col>
    </v-row>

    <v-row no-gutters class="w-100">
      <v-col>
        <v-subheader class="pl-0 pb-5">Window to capture overlay:</v-subheader>
        <v-row>
          <v-flex
            class="d-flex align-stretch"
            style="-webkit-app-region: no-drag"
          >
            <v-col cols="6">
              <v-text-field
                v-model="localCaptureWindowName"
                outlined
                clearable
                hide-details
                @change="changeCaptureWindowName"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-select
                item-text="programName"
                :items="localWindowArray"
                @change="changeCaptureWindowArray"
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
        <div class="w-100 h-100" style="height: 200px">
          <video id="stream-capture" class="w-100 h-100" muted autoplay></video>
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
