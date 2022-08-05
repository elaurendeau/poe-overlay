<script lang="ts">
import Vue from "vue";
import SettingsGridComponent from "@/frontend/views/component/SettingsGridComponent.vue";
import { SettingsGridModel } from "@/backend/model/settings-grid-model";
import { SettingsModel } from "@/backend/model/settings-model";
import { SettingsOverlayPositionEditorModel } from "@/backend/model/settings-overlay-position-editor-model";
import SettingsPositionEditorComponent from "@/frontend/views/component/SettingsPositionEditorComponent.vue";
import { ProfileModel } from "@/backend/model/profile-model";
import SettingsProfileComponent from "@/frontend/views/component/SettingsProfileComponent.vue";
import SettingsOverlayComponent from "@/frontend/views/component/SettingsOverlayComponent.vue";
import SettingsScreenCaptureSlotComponent from "@/frontend/views/component/SettingsScreenCaptureComponent.vue";

export default Vue.extend({
    name: "SettingsView",
    data() {
        return {
            settings: {
                settingsGrid: {} as SettingsGridModel,
                settingsOverlayPositionEditor: {} as SettingsOverlayPositionEditorModel,
                profileArray: [] as Array<ProfileModel>,
            } as SettingsModel,
            pagesHasErrors: false,
            windowPropertiesArray: [],
            showOverlaySettings: false,
            showGridSettings: false,
            showOverlayPositionEditorSettings: false,
            showScreenCaptureSettings: false,
            showGrid: false,
            showProfileSettings: true,
            drawer: true,
            mini: true,
            currentProfile: null,
        };
    },
    components: {
        SettingsGridComponent,
        SettingsOverlayComponent,
        SettingsPositionEditorComponent,
        SettingsScreenCaptureSlotComponent,
        SettingsProfileComponent,
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
            if (name === "profile") {
                this.hideAllSettings();
                this.showProfileSettings = true;
            } else if (name === "grid") {
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
            this.showProfileSettings = false;
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
    computed: {
        isFormValid() {
            return this.$store.state.profilesAreValid;
        },
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
                <v-alert
                    dense
                    outlined
                    type="info"
                    class="w-100"
                    v-if="!currentProfile"
                    style="margin-left: 2.5%; margin-top: 10px; width: 95%"
                >
                    Please select a profile within the <strong>Manage Profiles</strong> menu.
                </v-alert>

                <!-- If using vue-router -->
                <SettingsProfileComponent
                    :profile-array.sync="settings.profileArray"
                    :selected-profile.sync="currentProfile"
                    v-if="showProfileSettings && settings.profileArray?.length > 0"
                />

                <SettingsGridComponent
                    :column-count.sync="settings.settingsGrid.columnCount"
                    :row-count.sync="settings.settingsGrid.rowCount"
                    :display-center-lines.sync="settings.settingsGrid.displayCenterLines"
                    :grid-color.sync="settings.settingsGrid.color"
                    v-if="showGridSettings"
                />

                <SettingsOverlayComponent
                    :overlay-array.sync="currentProfile.settingsOverlay.overlayArray"
                    v-if="showOverlaySettings && currentProfile !== null"
                />

                <SettingsPositionEditorComponent
                    :capture-color-editor.sync="settings.settingsOverlayPositionEditor.capturePositionEditorColor"
                    :display-color-editor.sync="settings.settingsOverlayPositionEditor.displayPositionEditorColor"
                    v-if="showOverlayPositionEditorSettings"
                />

                <SettingsScreenCaptureSlotComponent
                    :window-name.sync="currentProfile.settingsScreenCapture.captureProgramName"
                    :window-source-array="windowPropertiesArray"
                    :stream-element-name="'stream-capture'"
                    v-if="showScreenCaptureSettings && currentProfile !== null"
                >
                    <template v-slot:title>Program to capture the image from:</template>
                </SettingsScreenCaptureSlotComponent>

                <v-alert
                    dense
                    outlined
                    type="error"
                    class="w-100"
                    style="margin-left: 2.5%; width: 95%"
                    v-if="showScreenCaptureSettings && currentProfile !== null"
                >
                    Application restart required after each change.
                </v-alert>
                <SettingsScreenCaptureSlotComponent
                    :window-name.sync="currentProfile.settingsScreenCapture.displayProgramName"
                    :window-source-array="windowPropertiesArray"
                    :stream-element-name="'stream-display'"
                    v-if="showScreenCaptureSettings && currentProfile !== null"
                >
                    <template v-slot:title>
                        <span>Program to display the image to:</span>
                    </template>
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
                    <v-list-item @click="showSettings('profile')">
                        <v-list-item-icon>
                            <v-icon>mdi-account-details</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Manage Profiles</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item v-if="currentProfile !== null">
                        <v-list-item-icon style="padding-left: 20px">
                            <v-icon>mdi-menu-right</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>{{ currentProfile.name }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item @click="showSettings('overlay')">
                        <v-list-item-icon>
                            <v-icon>mdi-buffer</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Manage Overlays</v-list-item-title>
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
                </v-list>

                <v-list :disabled="!isFormValid" class="mt-auto" dense>
                    <v-list-item @click="save">
                        <v-list-item-icon>
                            <v-icon :class="{ disabled: !isFormValid }">mdi-content-save</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title :class="{ disabled: !isFormValid }">Save</v-list-item-title>
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

.disabled
    cursor: not-allowed
    color: gray
</style>
