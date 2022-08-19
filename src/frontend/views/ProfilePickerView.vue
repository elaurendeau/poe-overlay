<script lang="ts">
import Vue from "vue";
import { SettingsModel } from "@/backend/model/settings-model";
import { ProfileModel } from "@/backend/model/profile-model";

export default Vue.extend({
    name: "SettingsProfileComponent",
    data() {
        return {
            settings: null as SettingsModel | null,
            localSelectedProfile: null as ProfileModel | null,
            showDialog: false,
            profileHeaderArray: [
                {
                    text: "",
                    value: "default",
                    sortable: false,
                },
                {
                    text: "Name",
                    align: "start",
                    value: "name",
                },
                {
                    text: "Capture Program",
                    value: "capture-program",
                    sortable: false,
                },
                {
                    text: "Display Program",
                    value: "display-program",
                    sortable: false,
                },
                {
                    text: "Actions",
                    value: "actions",
                    sortable: false,
                },
            ],
        };
    },
    mounted() {
        window.api.receive("update-settings", (event, data: SettingsModel) => {
            console.log(`Back.ipc -> update-settings '${JSON.stringify(data)}'`);
            if (data) {
                this.settings = data;
                this.settings.profileArray.forEach((profile) => {
                    if (profile.isDefaultProfile) {
                        this.localSelectedProfile = profile;
                    }
                });
            } else {
                throw new Error("Data is undefined");
            }
        });
    },
    methods: {
        selectProfile(profile, row) {
            this.localSelectedProfile = profile;
            this.$emit("update:selectedProfile", profile);
            row.select(true);
        },
        startStreaming() {
            console.log(`Front.ipc -> start-streaming ${JSON.stringify(this.localSelectedProfile?.name)}`);
            window.api.send("start-streaming", this.localSelectedProfile);
        },
    },
});
</script>

<template>
    <v-main style="background-color: transparent">
        <v-container id="container" v-if="settings !== null">
            <v-system-bar class="d-flex flex-row justify-end w-100" style="-webkit-app-region: drag" app>
            </v-system-bar>

            <v-row no-gutters class="w-100">
                <v-data-table
                    id="profile-table"
                    v-if="settings && settings.profileArray"
                    :headers="profileHeaderArray"
                    :items="this.settings.profileArray"
                    item-key="id"
                    hide-default-footer
                    single-select
                    @click:row="selectProfile"
                    class="elevation-1 w-100"
                    selectable-key="id"
                >
                    <template v-slot:[`item.default`]="{ item }">
                        <span><v-icon v-if="item.isDefaultProfile">mdi-star-outline</v-icon></span>
                    </template>

                    <template v-slot:[`item.name`]="{ item }">
                        <span>{{ `${item.name}` }}</span>
                    </template>

                    <template v-slot:[`item.capture-program`]="{ item }">
                        <span>{{ `${item.settingsScreenCapture.captureProgramName}` }}</span>
                    </template>

                    <template v-slot:[`item.display-program`]="{ item }">
                        <span>{{ `${item.settingsScreenCapture.displayProgramName}` }}</span>
                    </template>

                    <template v-slot:[`item.actions`]="{ item }">
                        <v-container class="d-flex">
                            <v-icon
                                v-if="localSelectedProfile && localSelectedProfile.id === item.id"
                                @click="startStreaming"
                                >mdi-play</v-icon
                            >
                        </v-container>
                    </template>
                </v-data-table>
            </v-row>
        </v-container>
    </v-main>
</template>

<style scoped lang="sass">
*
    padding: 0
    margin: 0
</style>
