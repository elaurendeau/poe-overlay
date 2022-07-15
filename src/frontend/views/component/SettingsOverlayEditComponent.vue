<script lang="ts">
import Vue, { PropType } from "vue";
import { OverlayModel } from "@/backend/model/overlay-model";
import { RectangleModel } from "@/backend/model/rectangle-model";

export default Vue.extend({
  name: "SettingsOverlayEditComponent",
  props: {
    dialog: Boolean,
    overlay: {
      type: Object as PropType<OverlayModel>,
    },
  },
  data() {
    return {
      localOverlay: JSON.parse(JSON.stringify(this.overlay)),
      localCaptureRectangle: {
        startX: this.overlay?.captureRectangle.startX,
        startY: this.overlay?.captureRectangle.startY,
        endX: this.overlay?.captureRectangle.endX,
        endY: this.overlay?.captureRectangle.endY,
      } as RectangleModel,
      showOverlayPositionEditor: false,
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel-dialog");
    },
    save() {
      this.localOverlay.captureRectangle = this.localCaptureRectangle;
      Object.assign(this.overlay, this.localOverlay);
      this.$emit("save-dialog", this.overlay);
    },
    toggleOverlayPositionEditor() {
      console.log("Front.ipc -> toggle-overlay-position-editor");
      this.showOverlayPositionEditor = !this.showOverlayPositionEditor;
      window.api.send("toggle-overlay-position-editor", this.localOverlay);
    },
  },

  mounted() {
    window.api.receive("resize-overlay-position-editor", (event, data) => {
      console.log(
        `Back.ipc -> resize-overlay-position-editor '${JSON.stringify(data)}'`
      );

      console.log(
        `Current local overlay ${JSON.stringify(this.localCaptureRectangle)}`
      );
      this.localCaptureRectangle.startX = data.startX;
      this.localCaptureRectangle.startY = data.startY;
      this.localCaptureRectangle.endX = data.endX;
      this.localCaptureRectangle.endY = data.endY;

      this.$forceUpdate();
    });
  },
});
</script>

<template>
  <v-dialog :value="dialog" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">Edit {{ localOverlay.name }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                label="Display Name*"
                v-model.lazy="localOverlay.name"
                required
              >
                ></v-text-field
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3" sm="6" md="4">
              <v-text-field
                label="Capture Start X Axis*"
                v-model.lazy="localCaptureRectangle.startX"
                type="number"
                required
              >
                ></v-text-field
              >
            </v-col>
            <v-col cols="3" sm="6" md="4">
              <v-text-field
                label="Capture Start Y Axis*"
                v-model.lazy="localCaptureRectangle.startY"
                type="number"
                required
              >
                ></v-text-field
              >
            </v-col>
            <v-col cols="3" sm="6" md="4">
              <v-text-field
                label="Capture End X Axis*"
                v-model.lazy="localOverlay.captureRectangle.endX"
                type="number"
                required
              >
                ></v-text-field
              >
            </v-col>
            <v-col cols="3" sm="6" md="4">
              <v-text-field
                label="Capture End Y Axis*"
                v-model.lazy="localCaptureRectangle.endY"
                type="number"
                required
              >
                ></v-text-field
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" sm="6" md="4">
              <v-text-field
                label="Display Start X Axis*"
                v-model.lazy="localOverlay.displayRectangle.startX"
                type="number"
                required
              >
                ></v-text-field
              >
            </v-col>
            <v-col cols="6" sm="6" md="4">
              <v-text-field
                label="Display Start Y Axis*"
                v-model.lazy="localOverlay.displayRectangle.startY"
                type="number"
                required
              >
                ></v-text-field
              >
            </v-col>
            <v-col cols="6" sm="6" md="4">
              <v-text-field
                label="Display End X Axis*"
                v-model.lazy="localOverlay.displayRectangle.endX"
                type="number"
                required
              >
                ></v-text-field
              >
            </v-col>
            <v-col cols="6" sm="6" md="4">
              <v-text-field
                label="Display End Y Axis*"
                v-model.lazy="localOverlay.displayRectangle.endY"
                type="number"
                required
              >
                ></v-text-field
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2" sm="6" md="4">
              <v-btn depressed @click="toggleOverlayPositionEditor">
                Record position
              </v-btn>
            </v-col>

            <v-col cols="2" sm="6" md="4">
              <v-btn depressed> Display position </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="sass">
*
  margin: 0
  padding: 0
</style>
