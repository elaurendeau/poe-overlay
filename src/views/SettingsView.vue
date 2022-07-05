<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "SettingsView",
  data() {
    return {
      drawer: true,
      mini: true,
    };
  },
  methods: {
    hide() {
      console.log("hide");
      window.api.send("hide-settings");
    },
    gridToggle() {
      window.api.send("toggle-grid");
    },
  },
});
</script>

<template>
  <v-app id="inspire">
    <v-card height="600" class="d-flex flex-row justify-end">
      <v-system-bar
        class="d-flex flex-row justify-end mb-6"
        style="-webkit-app-region: drag; width: 85%"
      >
        <div @click="hide" style="-webkit-app-region: no-drag">
          <v-icon>mdi-close-circle-outline</v-icon>
        </div>
      </v-system-bar>
      <v-navigation-drawer permanent right>
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

        <div style="height: 100%" class="d-flex flex-column">
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
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-content-save</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Save</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </v-navigation-drawer>
    </v-card>
  </v-app>
</template>

<style lang="sass">
v-list-item-title
  -webkit-user-select: none
</style>
