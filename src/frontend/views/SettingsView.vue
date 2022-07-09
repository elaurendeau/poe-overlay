<script lang="ts">
import Vue from "vue";
import SettingsGridComponent from "@/frontend/views/component/SettingsGridComponent.vue";
import { SettingsGridModel } from "@/backend/model/settings-grid-model";
import { SettingsModel } from "@/backend/model/settings-model";
import logger from "@/backend/logger/logger";
export default Vue.extend({
  name: "SettingsView",
  data() {
    return {
      settings: {
        settingsGrid: {} as SettingsGridModel,
      } as SettingsModel,
      showGridSettings: true,
      drawer: true,
      mini: true,
    };
  },
  components: {
    SettingsGridComponent,
  },
  methods: {
    hide() {
      console.debug("Front.ipc -> hide-settings");
      window.api.send("hide-settings");
    },
    gridToggle() {
      console.debug("Front.ipc -> toggle-grid");
      this.showGridSettings = !this.showGridSettings;
      window.api.send("toggle-grid");
    },
    save() {
      console.debug("Front.ipc -> save-settings");
      window.api.send("save-settings", this.settings);
    },
  },
});
</script>

<template>
  <v-app id="inspire">
    <!--    <v-card height="96%">-->
    <v-system-bar
      class="d-flex flex-row justify-end w-100"
      style="-webkit-app-region: drag"
      app
    >
      <div @click="hide" style="-webkit-app-region: no-drag">
        <v-icon>mdi-close-circle-outline</v-icon>
      </div>
    </v-system-bar>

    <!--      <v-card class="h-100">-->

    <v-main class="h-100">
      <v-container style="color: red" fluid>
        <!-- If using vue-router -->
        <SettingsGridComponent
          :column-count.sync="settings.settingsGrid.columnCount"
          :row-count.sync="settings.settingsGrid.rowCount"
          v-if="showGridSettings"
        />
      </v-container>
    </v-main>
    <v-navigation-drawer app permanent clipped right>
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
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-buffer</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Manage Overlays</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="gridToggle">
            <v-list-item-icon>
              <v-icon>mdi-border-none</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Show Grid</v-list-item-title>
            </v-list-item-content>
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
    <!--    </v-card>-->
    <!--    </v-card>-->
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
