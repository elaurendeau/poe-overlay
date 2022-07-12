<script lang="ts">
import Vue, { PropType } from "vue";
import { OverlayModel } from "@/backend/model/overlay-model";
import { v4 as uuidv4 } from "uuid";
import ConfirmDialogComponent from "@/frontend/views/component/ConfirmDialogComponent.vue";
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
  components: {
    ConfirmDialogComponent,
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
        id: uuidv4(),
        name: "new",
        captureCoordinate: {
          x: 0,
          y: 0,
        },
        captureLength: {
          x: 100,
          y: 100,
        },
        displayCoordinate: {
          x: 0,
          y: 0,
        },
      });
    },
    cancelDeleteOverlay() {
      this.deleteOverlayBuffer = null;
      this.displayConfirmDialog = false;
    },
    confirmDeleteOverlay(overlay) {
      this.deleteOverlayBuffer = overlay;
      this.displayConfirmDialog = true;
    },
    deleteOverlay() {
      if (this.deleteOverlayBuffer) {
        const index = this.localOverlayArray.indexOf(
          this.deleteOverlayBuffer,
          0
        );
        if (index > -1) {
          this.localOverlayArray.splice(index, 1);
        }
      }
      this.displayConfirmDialog = false;
    },
  },
  data() {
    return {
      localProgramName: this.programName,
      localWindowNameArray: this.windowNameArray,
      localOverlayArray: this.overlayArray,
      windowNameRefreshDegree: 0,
      displayConfirmDialog: false,
      deleteOverlayBuffer: null,
      overlayHeaderArray: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Position", value: "position" },
        { text: "Recording Position", value: "recording-position" },
        { text: "", value: "data-table-expand" },
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
        <span class="clicker" @click="createNewOverlay">
          <v-icon>mdi-plus-circle-outline</v-icon>
        </span>
      </v-col>
    </v-row>
    <v-row no-gutters class="w-100 mt-5">
      <v-data-table
        :headers="overlayHeaderArray"
        :items="this.localOverlayArray"
        single-expand
        item-key="id"
        hide-default-footer
        show-expand
        class="elevation-1 w-100"
      >
        <template v-slot:[`item.position`]="{ item }">
          <span>{{
            `(${item.displayCoordinate.x}, ${item.displayCoordinate.y}, ${
              item.displayCoordinate.x + item.captureLength.x
            }, ${item.displayCoordinate.y + item.captureLength.y})`
          }}</span>
        </template>

        <template v-slot:[`item.recording-position`]="{ item }">
          <span>{{
            `(${item.captureCoordinate.x}, ${item.captureCoordinate.y}, ${
              item.captureCoordinate.x + item.captureLength.x
            }, ${item.captureCoordinate.y + item.captureLength.y})`
          }}</span>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <v-icon small class="clicker" @click="confirmDeleteOverlay(item)">
            mdi-delete
          </v-icon>
          <td :colspan="headers.length">{{ JSON.stringify(item) }}</td>
        </template>
      </v-data-table></v-row
    >
    <ConfirmDialogComponent
      :dialog.sync="displayConfirmDialog"
      @cancel-dialog="cancelDeleteOverlay"
      @confirm-dialog="deleteOverlay"
    />
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
