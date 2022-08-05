<script lang="ts">
import Vue, { PropType } from "vue";
import { ProfileModel } from "@/backend/model/profile-model";

export default Vue.extend({
    name: "SettingsProfileEditComponent",
    props: {
        dialog: Boolean,
        profile: {
            type: Object as PropType<ProfileModel>,
        },
    },
    data() {
        return {
            localProfile: JSON.parse(JSON.stringify(this.profile)),
            showOverlayCapturePositionEditor: false,
            showOverlayDisplayPositionEditor: false,
        };
    },
    methods: {
        cancel() {
            this.$emit("cancel-dialog");
        },
        save() {
            this.$emit("save-dialog", this.localProfile);
        },
    },
});
</script>

<template>
    <v-dialog :value="dialog" max-width="500px" persistent>
        <v-card>
            <v-card-title>
                <span class="text-h5">Edit {{ localProfile.name }}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field label="Display Name*" v-model.lazy="localProfile.name" required>
                                >
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="3" sm="6" md="4">
                            <v-checkbox
                                label="Set this profile as the default profile: "
                                v-model.lazy="localProfile.isDefaultProfile"
                                required
                            >
                                >
                            </v-checkbox>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn @click="cancel">Cancel</v-btn>
                <v-btn @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped lang="sass">
*
    margin: 0
    padding: 0
</style>
