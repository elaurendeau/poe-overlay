<script lang="ts">
import Vue, { PropType } from "vue";
import { WindowPropertiesModel } from "@/backend/model/window-properties-model";

export default Vue.extend({
    name: "SettingsScreenCaptureSlotComponent",
    props: {
        windowName: {
            type: String,
            default: "",
        },
        windowPropertiesArray: {
            type: Array as PropType<Array<WindowPropertiesModel>>,
            default: () => [],
        },
        streamElementName: {
            type: String,
            default: "",
        },
    },
    methods: {
        changeWindowName() {
            console.log(`changeWindowName ${this.localWindowName}`);

            this.updateCurrentWindowProperties();
            this.$emit("update:windowName", this.localWindowName);
        },
        async refreshWindowNameArray() {
            console.log(`Front.ipc -> refresh-window-list`);
            this.windowNameRefreshDegree += 360;
            window.api.invoke("refresh-window-list").then((windowArray) => {
                console.log(`Front.ipc -> refresh-window-list ${JSON.stringify(windowArray)}`);
                this.localWindowArray = windowArray;
                this.updateCurrentWindowProperties();
            });
        },
        async changeWindowArray(windowProperties) {
            console.log(`changeWindowArray ${JSON.stringify(windowProperties)}`);

            this.localWindowName = windowProperties.programName;
            this.currentWindowProperties = windowProperties;
            this.changeWindowName();
        },

        async updateVideoStream() {
            console.log(`updateVideoStream ${JSON.stringify(this.currentWindowProperties)} `);

            const htmlVideoElement = this.$el.querySelector("video");
            if (htmlVideoElement) {
                if (!this.currentWindowProperties) {
                    htmlVideoElement.srcObject = null;
                } else {
                    await window.api.stream("stream-full-window", this.currentWindowProperties!, htmlVideoElement);
                }
            }
        },
        updateCurrentWindowProperties() {
            console.log(`updateCurrentWindowProperties ${this.localWindowName}`);
            if (this.localWindowName) {
                const filteredWindowArray = this.localWindowArray?.filter(
                    (windowSourceProperties: WindowPropertiesModel) => {
                        return windowSourceProperties.programName === this.localWindowName;
                    }
                );

                if (filteredWindowArray.length >= 1) {
                    this.currentWindowPropertiesIsValid = false;
                    this.currentWindowProperties = filteredWindowArray[0];
                    this.updateVideoStream();
                    console.log("Updating;;" + this.currentWindowPropertiesIsValid);
                    return;
                }
            }
            this.currentWindowPropertiesIsValid = true;
            this.currentWindowProperties = null;
            this.updateVideoStream();
            throw new Error("Unable to find a window match");
        },
    },
    data() {
        return {
            localWindowName: this.windowName,
            localWindowArray: this.windowPropertiesArray,
            currentWindowProperties: null as WindowPropertiesModel | null,
            currentWindowPropertiesIsValid: false,
            windowNameRefreshDegree: 0,
            localStream: null as MediaStream | null,
        };
    },
    watch: {},
    mounted() {
        window.api.receive("update-window-list", (event, data) => {
            console.log(`SettingsScreenCapture -> Back.ipc -> update-window-list '${JSON.stringify(data)}'`);

            this.localWindowArray = data;
            this.updateCurrentWindowProperties();

            this.$forceUpdate;
        });

        this.localWindowName = this.windowName;
        this.refreshWindowNameArray();
    },
});
</script>

<template>
    <v-container id="container">
        <v-row no-gutters class="w-100">
            <v-col>
                <v-subheader class="pl-0 pb-5">
                    <slot name="title"></slot>
                </v-subheader>
                <v-row>
                    <v-flex class="d-flex align-stretch" style="-webkit-app-region: no-drag">
                        <v-col cols="6">
                            <v-text-field
                                v-model="localWindowName"
                                outlined
                                clearable
                                hide-details
                                :error="currentWindowPropertiesIsValid"
                                @change="changeWindowName"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="5">
                            <v-select
                                item-text="programName"
                                :items="localWindowArray"
                                @change="changeWindowArray"
                                outlined
                                hide-details
                                return-object
                            >
                            </v-select>
                        </v-col>
                        <v-col
                            cols="1"
                            justify-center
                            class="d-flex align-stretch justify-end clicker"
                            @click="refreshWindowNameArray"
                        >
                            <v-icon
                                class="transition"
                                v-bind:style="{
                                    transform: `rotate(${windowNameRefreshDegree}deg)`,
                                }"
                                >mdi-refresh
                            </v-icon>
                        </v-col>
                    </v-flex>
                </v-row>
            </v-col>
        </v-row>
        <v-row class="mt-7">
            <v-col>
                <div class="w-100 h-100" style="height: 250px">
                    <video class="w-100 h-100" muted autoplay></video>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped lang="sass">
*
    margin: 0
    padding: 0

#container
    padding: 25px

.transition
    transition: transform 0.5s ease-in-out
</style>
