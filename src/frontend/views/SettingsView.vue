<script lang="ts">
import Vue from "vue";
import SettingsGridComponent from "@/frontend/views/component/SettingsGridComponent.vue";
import { SettingsGridModel } from "@/backend/model/settings-grid-model";
import { SettingsModel } from "@/backend/model/settings-model";
import { SettingsOverlayModel } from "@/backend/model/settings-overlay-model";
import SettingsOverlayComponent from "@/frontend/views/component/SettingsOverlayComponent.vue";

export default Vue.extend({
  name: "SettingsView",
  data() {
    return {
      settings: {
        settingsGrid: {} as SettingsGridModel,
        settingsOverlay: {} as SettingsOverlayModel,
      } as SettingsModel,
      windowNameArray: [],
      showOverlaySettings: true,
      showGridSettings: false,
      showGrid: false,
      drawer: true,
      mini: true,
    };
  },
  components: {
    SettingsGridComponent,
    SettingsOverlayComponent,
  },
  methods: {
    hide() {
      console.log("Front.ipc -> hide-settings");
      window.api.send("hide-settings");
    },
    gridToggle() {
      console.log("Front.ipc -> toggle-grid");
      this.showGrid = !this.showGrid;
      window.api.send("toggle-grid");
    },
    save() {
      console.log(
        `Front.ipc -> save-settings ${JSON.stringify(this.settings)}`
      );
      window.api.send("save-settings", this.settings);
    },
    showSettings(name: string) {
      if (name === "grid") {
        this.showGridSettings = true;
        this.showOverlaySettings = false;
      } else if (name === "overlay") {
        console.log(`Value show grid settings ${this.showGridSettings}`);
        console.log(`Value show overlay settings ${this.showOverlaySettings}`);
        this.showGridSettings = false;
        this.showOverlaySettings = true;
      }
    },

    swapShowComponents() {
      this.showGridSettings = !this.showGridSettings;
      this.showOverlaySettings = !this.showOverlaySettings;
    },
  },
  mounted() {
    window.api.receive("update-settings", (event, data) => {
      console.log(`Back.ipc -> update-settings '${JSON.stringify(data)}'`);

      this.settings = data;
      this.swapShowComponents();

      this.$nextTick(() => {
        // Adding the component back in
        this.swapShowComponents();
      });

      this.$forceUpdate;
    });
  },
});
</script>

<template>
  <v-app id="inspire">
    <v-system-bar
      class="d-flex flex-row justify-end w-100"
      style="-webkit-app-region: drag"
      app
    >
      <div @click="hide" style="-webkit-app-region: no-drag">
        <v-icon>mdi-close-circle-outline</v-icon>
      </div>
    </v-system-bar>

    <v-main class="h-100">
      <v-container style="color: red" fluid>
        <!-- If using vue-router -->
        <SettingsGridComponent
          :column-count.sync="settings.settingsGrid.columnCount"
          :row-count.sync="settings.settingsGrid.rowCount"
          :display-center-lines.sync="settings.settingsGrid.displayCenterLines"
          :grid-color.sync="settings.settingsGrid.color"
          v-if="showGridSettings"
        />

        <SettingsOverlayComponent
          :programName.sync="settings.settingsOverlay.programName"
          :overlay-array.sync="settings.settingsOverlay.overlayArray"
          :window-name-array.sync="windowNameArray"
          v-if="showOverlaySettings"
        />
      </v-container>
    </v-main>
    <v-navigation-drawer app permanent clipped right style="padding: 15px">
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <v-icon left large>mdi-cog</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-container
        style="margin: 0; padding: 0; border: 0"
        class="d-flex flex-column h-100"
      >
        <v-list dense>
          <v-list-item @click="showSettings('overlay')">
            <v-list-item-icon>
              <v-icon>mdi-buffer</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Manage Overlays</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="showSettings('grid')">
            <v-list-item-icon>
              <v-icon>mdi-border-none</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Show Grid</v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon @click="gridToggle">
              <v-icon v-if="!showGrid">mdi-eye-off-outline</v-icon>
              <v-icon v-if="showGrid">mdi-eye-outline</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>

        <v-list class="mt-auto" dense>
          <v-list-item @click="save">
            <v-list-item-icon>
              <v-icon>mdi-content-save</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Save</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-container>
    </v-navigation-drawer>
  </v-app>
</template>

<style scoped lang="sass">
*
  margin: 0
  padding: 0

v-list-item-title
  -webkit-user-select: none

#settings-content
  padding: 25px
</style>
