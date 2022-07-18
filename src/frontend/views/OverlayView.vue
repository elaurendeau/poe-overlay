<template>
    <v-container id="container" fluid>
        <div
            class="display-box"
            v-for="overlay in settings.settingsOverlay.overlayArray"
            :key="overlay.id"
            :style="{
                width: `${overlay.displayRectangle.endX - overlay.displayRectangle.startX}px`,
                height: `${overlay.displayRectangle.endY - overlay.displayRectangle.startY}px`,
                position: `absolute`,
                left: `${overlay.displayRectangle.startX}px`,
                top: `${overlay.displayRectangle.startY}px`,
            }"
        ></div>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { SettingsGridModel } from "@/backend/model/settings-grid-model";
import { SettingsOverlayModel } from "@/backend/model/settings-overlay-model";
import { SettingsOverlayPositionEditorModel } from "@/backend/model/settings-overlay-position-editor-model";
import { SettingsScreenCaptureModel } from "@/backend/model/settings-screen-capture";
import { SettingsModel } from "@/backend/model/settings-model";

export default Vue.extend({
    name: "OverlayView",
    data() {
        return {
            settings: {
                settingsGrid: {} as SettingsGridModel,
                settingsOverlay: {} as SettingsOverlayModel,
                settingsOverlayPositionEditor: {} as SettingsOverlayPositionEditorModel,
                settingsScreenCapture: {} as SettingsScreenCaptureModel,
            } as SettingsModel,
        };
    },

    mounted() {
        window.api.receive("update-settings", (event, data) => {
            console.log(`Back.ipc -> update-settings '${JSON.stringify(data)}'`);

            this.settings = data;
            this.$forceUpdate;
        });
    },
});
</script>

<style scoped lang="sass">
*
    padding: 0
    margin: 0

#container
    width: 100vw
    height: 100vh
    background-color: transparent

.display-box
    background-color: #0029FF58
</style>
