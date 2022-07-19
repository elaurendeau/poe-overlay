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

            this.$emit("update:windowName", this.localWindowName);
        },
        async refreshWindowNameArray() {
            console.log(`Front.ipc -> refresh-settings-window-array`);
            window.api.send("refresh-settings-window-array");
            this.windowNameRefreshDegree += 360;
        },
        async changeWindowArray(windowProperties) {
            console.log(`changeWindowArray ${JSON.stringify(windowProperties)}`);

            this.localWindowName = windowProperties.programName;
            this.currentWindowProperties = windowProperties;
            this.changeWindowName();

            await this.updateVideoStream(windowProperties);
        },

        async updateVideoStream(windowProperties) {
            console.log(`updateVideoStream ${JSON.stringify(windowProperties)} `);

            const htmlVideoElement = this.$el.querySelector("video");
            if (htmlVideoElement) {
                const stream = await window.api.stream("stream-full-window", windowProperties, htmlVideoElement);
            }
        },
        updateCurrentWindowProperties(localWindowName): WindowPropertiesModel {
            console.log(`updateVideoStream ${localWindowName}`);
            if (localWindowName) {
                const filteredWindowArray = this.localWindowArray?.filter(
                    (windowSourceProperties: WindowPropertiesModel) => {
                        return windowSourceProperties.programName === localWindowName;
                    }
                );

                console.log(`Filtered list ${JSON.stringify(filteredWindowArray)}`);
                if (filteredWindowArray.length === 1) {
                    return filteredWindowArray[0];
                }
            }
            throw new Error("Unable to find a window match");
        },
    },
    data() {
        return {
            localWindowName: this.windowName,
            localWindowArray: this.windowPropertiesArray,
            currentWindowProperties: null as WindowPropertiesModel | null,
            windowNameRefreshDegree: 0,
            localStream: null as MediaStream | null,
        };
    },
    watch: {
        currentWindowProperties(newValue) {
            console.log(`currentDisplayWindowProperties ${newValue}`);
            if (newValue) {
                this.updateVideoStream(newValue);
            }
        },
    },
    mounted() {
        window.api.receive("update-window-list", (event, data) => {
            console.log(`SettingsScreenCapture -> Back.ipc -> update-window-list '${JSON.stringify(data)}'`);

            this.localWindowArray = data;

            if (!this.currentWindowProperties) {
                this.currentWindowProperties = this.updateCurrentWindowProperties(this.localWindowName);
            }

            if (!this.currentWindowProperties) {
                this.currentWindowProperties = this.updateCurrentWindowProperties(this.localWindowName);
            }

            this.$forceUpdate;
        });
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
