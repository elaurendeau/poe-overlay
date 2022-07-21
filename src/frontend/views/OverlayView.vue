<template>
    <v-container id="container" fluid>
        <!--        <canvas-->
        <!--            class="display-box"-->
        <!--            v-for="overlay in settings.settingsOverlay.overlayArray"-->
        <!--            :key="overlay.id"-->
        <!--            :style="{-->
        <!--                width: `${overlay.displayRectangle.endX - overlay.displayRectangle.startX}px`,-->
        <!--                height: `${overlay.displayRectangle.endY - overlay.displayRectangle.startY}px`,-->
        <!--                position: `absolute`,-->
        <!--                left: `${overlay.displayRectangle.startX}px`,-->
        <!--                top: `${overlay.displayRectangle.startY}px`,-->
        <!--            }"-->
        <!--        ></canvas>-->
        <video class="shown fullscreen-relative" autoplay></video>
        <canvas id="canvas" class="fullscreen-relative"></canvas>
        <video class="hidden fullscreen-relative" style="display: none" autoplay></video>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { SettingsGridModel } from "@/backend/model/settings-grid-model";
import { SettingsOverlayModel } from "@/backend/model/settings-overlay-model";
import { SettingsOverlayPositionEditorModel } from "@/backend/model/settings-overlay-position-editor-model";
import { SettingsScreenCaptureModel } from "@/backend/model/settings-screen-capture";
import { SettingsModel } from "@/backend/model/settings-model";
import { WindowPropertiesModel } from "@/backend/model/window-properties-model";

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
            windowPropertiesArray: [] as Array<WindowPropertiesModel>,
            currentWindowProperties: null as WindowPropertiesModel | null,
        };
    },

    methods: {
        findMatchingWindowProperties() {
            if (!this.currentWindowProperties && this.settings.settingsScreenCapture.captureProgramName) {
                const windowPropertiesFilteredArray = this.windowPropertiesArray.filter((currentWindowProperties) => {
                    return (
                        currentWindowProperties.programName === this.settings.settingsScreenCapture.captureProgramName
                    );
                });

                if (windowPropertiesFilteredArray[0]) {
                    this.currentWindowProperties = windowPropertiesFilteredArray[0];
                }
            }
        },

        handleStream() {
            console.log("handleStream");
            this.findMatchingWindowProperties();
            const htmlCanvasElement = this.$el.querySelector("canvas");

            if (!htmlCanvasElement) {
                throw new Error("unable to locate canvas");
            }

            if (!this.currentWindowProperties) {
                throw new Error("unable to locate 'this.currentWindowProperties'");
            }

            if (!this.settings.settingsOverlay.overlayArray) {
                throw new Error("unable to locate 'this.settings.settingsOverlay.overlayArray'");
            }

            console.log({ htmlCanvasElement });
            window.api.overlayStream(
                "TODO",
                this.currentWindowProperties,
                this.settings.settingsOverlay.overlayArray,
                htmlCanvasElement,
                this.$el.querySelector("video.hidden"),
                this.$el.querySelector("video.shown")
            );
        },
    },

    mounted() {
        window.api.receive("update-settings", (event, data) => {
            console.log(`Back.ipc -> update-settings '${JSON.stringify(data)}'`);
            if (data) {
                this.settings = data;
                this.handleStream();
            } else {
                throw new Error("Data is undefined");
            }
        });

        window.api.receive("update-window-list", (event, data) => {
            console.log(`Back.ipc -> update-window-list '${JSON.stringify(data)}'`);
            if (data) {
                this.windowPropertiesArray = data;
                this.handleStream();
            } else {
                throw new Error("Data is undefined");
            }
        });
    },
});
</script>

<style scoped lang="sass">
*
    padding: 0
    margin: 0

#container
    background-color: transparent
    width: 100vw
    height: 100vh

.fullscreen-relative
    width: 100%
    height: 100%
    position: absolute
</style>
