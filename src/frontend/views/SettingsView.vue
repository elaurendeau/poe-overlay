<script lang="ts">
import Vue from "vue";
import SettingsGridComponent from "@/frontend/views/component/SettingsGridComponent.vue";
import { SettingsGridModel } from "@/backend/model/settings-grid-model";
import { SettingsModel } from "@/backend/model/settings-model";
import { SettingsOverlayModel } from "@/backend/model/settings-overlay-model";
import SettingsOverlayComponent from "@/frontend/views/component/SettingsOverlayComponent.vue";
import { SettingsOverlayPositionEditorModel } from "@/backend/model/settings-overlay-position-editor-model";
import SettingsPositionEditorComponent from "@/frontend/views/component/SettingsPositionEditorComponent.vue";
import { SettingsScreenCaptureModel } from "@/backend/model/settings-screen-capture";
import SettingsScreenCaptureSlotComponent from "@/frontend/views/component/SettingsScreenCaptureComponent.vue";

export default Vue.extend({
    name: "SettingsView",
    data() {
        return {
            settings: {
                settingsGrid: {} as SettingsGridModel,
                settingsOverlay: {} as SettingsOverlayModel,
                settingsOverlayPositionEditor: {} as SettingsOverlayPositionEditorModel,
                settingsScreenCapture: {} as SettingsScreenCaptureModel,
            } as SettingsModel,
            windowPropertiesArray: [],
            showOverlaySettings: true,
            showGridSettings: false,
            showOverlayPositionEditorSettings: false,
            showScreenCaptureSettings: false,
            showGrid: false,
            drawer: true,
            mini: true,
        };
    },
    components: {
        SettingsGridComponent,
        SettingsOverlayComponent,
        SettingsPositionEditorComponent,
        SettingsScreenCaptureSlotComponent,
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
            console.log(`Front.ipc -> save-settings ${JSON.stringify(this.settings)}`);
            window.api.send("save-settings", this.settings);
        },
        showSettings(name: string) {
            if (name === "grid") {
                this.hideAllSettings();
                this.showGridSettings = true;
            } else if (name === "overlay") {
                this.hideAllSettings();
                this.showOverlaySettings = true;
            } else if (name === "overlayPositionEditor") {
                this.hideAllSettings();
                this.showOverlayPositionEditorSettings = true;
            } else if (name === "screenCapture") {
                this.hideAllSettings();
                this.showScreenCaptureSettings = true;
            }
        },

        hideAllSettings() {
            this.showGridSettings = false;
            this.showOverlaySettings = false;
            this.showOverlayPositionEditorSettings = false;
            this.showScreenCaptureSettings = false;
        },

        swapShowComponents() {
            this.showGridSettings = !this.showGridSettings;
            this.showOverlaySettings = !this.showOverlaySettings;
        },
    },
    mounted() {
        window.api.receive("update-settings", (event, data) => {
            console.log(`SettingsView.receive -> update-settings '${JSON.stringify(data)}'`);

            this.settings = data;
            this.swapShowComponents();

            this.$nextTick(() => {
                // Adding the component back in
                this.swapShowComponents();
            });

            this.$forceUpdate;
        });

        window.api.receive("update-window-list", (event, data) => {
            console.log(`SettingsView.receive -> update-window-list '${JSON.stringify(data)}'`);

            this.windowPropertiesArray = data;
        });
    },
});
</script>

<template>
    <v-app id="inspire">
        <v-system-bar class="d-flex flex-row justify-end w-100" style="-webkit-app-region: drag" app>
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
                    :overlay-array.sync="settings.settingsOverlay.overlayArray"
                    v-if="showOverlaySettings"
                />

                <SettingsPositionEditorComponent
                    :capture-color-editor.sync="settings.settingsOverlayPositionEditor.capturePositionEditorColor"
                    :display-color-editor.sync="settings.settingsOverlayPositionEditor.displayPositionEditorColor"
                    v-if="showOverlayPositionEditorSettings"
                />

                <SettingsScreenCaptureSlotComponent
                    :window-name.sync="settings.settingsScreenCapture.captureProgramName"
                    :window-source-array="windowPropertiesArray"
                    :stream-element-name="'stream-capture'"
                    v-if="showScreenCaptureSettings"
                >
                    <template v-slot:title>Program to capture the image from:</template>
                </SettingsScreenCaptureSlotComponent>

                <SettingsScreenCaptureSlotComponent
                    :window-name.sync="settings.settingsScreenCapture.displayProgramName"
                    :window-source-array="windowPropertiesArray"
                    :stream-element-name="'stream-display'"
                    v-if="showScreenCaptureSettings"
                >
                    <template v-slot:title>Program to display the image to:</template>
                </SettingsScreenCaptureSlotComponent>
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

            <v-container style="margin: 0; padding: 0; border: 0" class="d-flex flex-column h-100">
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
                            <v-list-item-title>Grid Layout</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-icon @click="gridToggle">
                            <v-icon v-if="!showGrid">mdi-eye-off-outline</v-icon>
                            <v-icon v-if="showGrid">mdi-eye-outline</v-icon>
                        </v-list-item-icon>
                    </v-list-item>

                    <v-list-item @click="showSettings('overlayPositionEditor')">
                        <v-list-item-icon>
                            <v-icon>mdi-cursor-move</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Position Editor</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item @click="showSettings('screenCapture')">
                        <v-list-item-icon>
                            <v-icon>mdi-monitor-eye</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Screen Capture</v-list-item-title>
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
