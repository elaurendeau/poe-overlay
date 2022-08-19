<script lang="ts">
import Vue, { PropType } from "vue";
import { v4 as uuidv4 } from "uuid";
import { ProfileModel } from "@/backend/model/profile-model";
import SettingsProfileEditComponent from "@/frontend/views/component/SettingsProfileEditComponent.vue";
import { SettingsScreenCaptureModel } from "@/backend/model/settings-screen-capture";
import { SettingsOverlayModel } from "@/backend/model/settings-overlay-model";
export default Vue.extend({
    name: "SettingsProfileComponent",
    props: {
        profileArray: {
            type: Array as PropType<ProfileModel[]>,
            default: () => [],
        },
        selectedProfile: {
            type: Object as PropType<ProfileModel>,
        },
    },
    components: {
        SettingsProfileEditComponent,
    },
    data() {
        return {
            localProfileArray: this.profileArray,
            localSelectedProfile: this.selectedProfile,
            isProfileValid: true,
            currentProfileBuffer: null,
            showDialog: false,
            profileHeaderArray: [
                { text: "", value: "default", sortable: false },
                {
                    text: "Name",
                    align: "start",
                    value: "name",
                },
                { text: "Capture Program", value: "capture-program", sortable: false },
                { text: "Display Program", value: "display-program", sortable: false },
                { text: "Actions", value: "actions", sortable: false },
            ],
        };
    },
    mounted() {
        this.localProfileArray = this.profileArray;
        this.validateProfiles(this.localProfileArray);
    },
    watch: {
        localProfileArray(newArray) {
            this.validateProfiles(newArray);
            if (this.isProfileValid) {
                this.$emit("update:profileArray", this.profileArray);
            }
        },
    },
    methods: {
        validateProfiles(profiles) {
            this.isProfileValid = profiles.some((it) => it.isDefaultProfile);
            this.$store.state.profilesAreValid = this.isProfileValid;
        },
        editProfile(profile) {
            this.currentProfileBuffer = profile;
            this.showDialog = true;
        },
        selectProfile(profile, row) {
            this.localSelectedProfile = profile;
            this.$emit("update:selectedProfile", profile);
            row.select(true);
        },
        cancelEditProfile() {
            this.currentProfileBuffer = null;
            this.showDialog = false;
        },

        saveEditProfile(item) {
            this.currentProfileBuffer = null;
            this.showDialog = false;

            if (item.isDefaultProfile) {
                this.localProfileArray?.forEach((it) => {
                    it.isDefaultProfile = false;
                });
            }

            const itemToModify = this.localProfileArray?.find((it) => it.id === item.id);
            Object.assign(itemToModify, item);

            this.validateProfiles(this.localProfileArray);
        },
        addNewProfile() {
            console.log(`${JSON.stringify(this.localProfileArray)}`);
            const newProfile = {
                id: uuidv4(),
                isDefaultProfile: false,
                name: "change me",
                settingsScreenCapture: {
                    captureProgramName: "Path of Exile",
                    displayProgramName: "Path of Exile",
                } as SettingsScreenCaptureModel,
                settingsOverlay: {
                    overlayArray: [],
                } as SettingsOverlayModel,
            } as ProfileModel;
            this.localProfileArray?.push(newProfile);
        },
    },
});
</script>

<template>
    <v-container id="container">
        <v-row no-gutters class="w-100 mt-5">
            <v-col>
                <v-subheader class="pl-0 pb-5">Manage Profiles:</v-subheader>
            </v-col>
            <v-col class="d-flex justify-end">
                <span class="clicker">
                    <v-icon @click="addNewProfile">mdi-plus-circle-outline</v-icon>
                </span>
            </v-col>
        </v-row>
        <v-row no-gutters class="w-100 mt-5">
            <v-alert dense outlined type="error" class="w-100" v-if="!isProfileValid">
                Set <strong>one</strong> profile to <strong>default</strong> prior to saving your settings.
            </v-alert>
            <v-data-table
                id="profile-table"
                :headers="profileHeaderArray"
                :items="this.localProfileArray"
                item-key="id"
                hide-default-footer
                single-select
                @click:row="selectProfile"
                :class="{ 'red-border': !isProfileValid }"
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
                        <v-icon small class="clicker" @click="editProfile(item)"> mdi-pencil-outline </v-icon>
                        <v-icon small class="clicker ml-auto"> mdi-delete-outline </v-icon>
                    </v-container>
                </template>
            </v-data-table>
        </v-row>

        <SettingsProfileEditComponent
            v-if="currentProfileBuffer"
            :profile="currentProfileBuffer"
            :key="currentProfileBuffer.id"
            :dialog.sync="showDialog"
            @cancel-dialog="cancelEditProfile"
            @save-dialog="saveEditProfile"
        />
    </v-container>
</template>

<style scoped lang="sass">
*
    padding: 0
    margin: 0

#container
    padding: 25px

.red-border
    border: 1px solid var(--v-error-base)
</style>
