<template>
    <v-container id="container" fluid>
        <video class="shown fullscreen-relative" autoplay></video>
        <canvas id="canvas" class="fullscreen-relative"></canvas>
        <video class="hidden fullscreen-relative" style="display: none" autoplay></video>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { WindowPropertiesModel } from "@/backend/model/window-properties-model";
import { ProfileModel } from "@/backend/model/profile-model";

export default Vue.extend({
    name: "OverlayView",
    data() {
        return {
            profile: null as ProfileModel | null,
            windowPropertiesArray: [] as Array<WindowPropertiesModel>,
            currentWindowProperties: null as WindowPropertiesModel | null,
        };
    },

    methods: {
        findMatchingWindowProperties() {
            if (!this.currentWindowProperties && this.profile?.settingsScreenCapture.captureProgramName) {
                const windowPropertiesFilteredArray = this.windowPropertiesArray.filter((currentWindowProperties) => {
                    return (
                        currentWindowProperties.programName === this.profile?.settingsScreenCapture.captureProgramName
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

            if (!this.profile?.settingsOverlay.overlayArray) {
                throw new Error("unable to locate 'this.profile.settingsOverlay.overlayArray'");
            }

            console.log({ htmlCanvasElement });
            window.api.overlayStream(
                "TODO",
                this.currentWindowProperties,
                this.profile.settingsOverlay.overlayArray,
                htmlCanvasElement,
                this.$el.querySelector("video.hidden"),
                this.$el.querySelector("video.shown")
            );
        },
    },

    mounted() {
        window.api.receive("update-profile", (event, data) => {
            console.log(`Back.ipc -> update-profile '${JSON.stringify(data)}'`);
            if (data) {
                this.profile = data;
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
