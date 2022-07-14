<script lang="ts">
import Vue, { PropType } from "vue";
import { OverlayModel } from "@/backend/model/overlay-model";

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
      localOverlay: Object.assign({}, this.overlay),
      showOverlayPositionEditor: false,
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel-dialog");
    },
    save() {
      Object.assign(this.overlay, this.localOverlay);
      this.$emit("save-dialog", this.overlay);
    },
    gridOverlayPositionEditor() {
      console.log("Front.ipc -> toggle-overlay-position-editor");
      this.showOverlayPositionEditor = !this.showOverlayPositionEditor;
      window.api.send("toggle-overlay-position-editor");
    },
  },
});
</script>

<template>
  <v-dialog :value="dialog" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">Overlay edit</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                label="Overlay display name*"
                v-model.lazy="localOverlay.name"
                required
              >
                ></v-text-field
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2" sm="6" md="4">
              <v-btn depressed @click="gridOverlayPositionEditor">
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
