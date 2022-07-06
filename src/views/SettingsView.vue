<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "SettingsView",
  data() {
    return {
      showGridSettings: true,
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
      this.showGridSettings = !this.showGridSettings;
      window.api.send("toggle-grid");
    },
  },
});
</script>

<template>
  <v-app id="inspire">
    <v-card height="96%">
      <v-system-bar
        class="d-flex flex-row justify-end w-100"
        style="-webkit-app-region: drag"
      >
        <div @click="hide" style="-webkit-app-region: no-drag">
          <v-icon>mdi-close-circle-outline</v-icon>
        </div>
      </v-system-bar>

      <v-card class="h-100">
        <SettingsGridComponent v-if="showGridSettings" />

        <v-navigation-drawer absolute permanent right>
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
              <v-list-item>
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
      </v-card>
    </v-card>
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
