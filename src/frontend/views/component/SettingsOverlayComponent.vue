<script lang="ts">
import Vue, { PropType } from "vue";
import { OverlayModel } from "@/backend/model/overlay-model";
import { v4 as uuidv4 } from "uuid";
import ConfirmDialogComponent from "@/frontend/views/component/ConfirmDialogComponent.vue";
import SettingsOverlayEditComponent from "@/frontend/views/component/SettingsOverlayEditComponent.vue";

export default Vue.extend({
    name: "SettingsOverlayComponent",
    props: {
        overlayArray: {
            type: Array as PropType<OverlayModel[]>,
            default: () => [],
        },
    },
    components: {
        ConfirmDialogComponent,
        SettingsOverlayEditComponent,
    },
    methods: {
        hideOverlayPositionEditor() {
            console.log("Front.ipc -> hide-overlay-position-editor");
            window.api.send("hide-overlay-position-editor");
        },

        createNewOverlay() {
            this.localOverlayArray?.push({
                id: uuidv4(),
                name: "new",
                displayRectangle: {
                    startX: 0,
                    startY: 0,
                    endX: 100,
                    endY: 50,
                },
                captureRectangle: {
                    startX: 200,
                    startY: 200,
                    endX: 300,
                    endY: 250,
                },
            });
        },
        editOverlay(overlay) {
            this.currentOverlayBuffer = overlay;
            this.displayEditDialog = true;
        },
        cancelEditOverlay() {
            this.currentOverlayBuffer = null;
            this.displayEditDialog = false;
            this.hideOverlayPositionEditor();
        },
        saveEditOverlay() {
            this.currentOverlayBuffer = null;
            this.displayEditDialog = false;
            this.hideOverlayPositionEditor();
        },
        cancelDeleteOverlay() {
            this.currentOverlayBuffer = null;
            this.displayConfirmDialog = false;
        },
        confirmDeleteOverlay(overlay) {
            this.currentOverlayBuffer = overlay;
            this.displayConfirmDialog = true;
        },
        deleteOverlay() {
            if (this.currentOverlayBuffer) {
                const index = this.localOverlayArray.indexOf(this.currentOverlayBuffer, 0);
                if (index > -1) {
                    this.localOverlayArray.splice(index, 1);
                }
            }
            this.displayConfirmDialog = false;
        },
    },
    data() {
        return {
            localOverlayArray: this.overlayArray,
            displayConfirmDialog: false,
            displayEditDialog: false,
            currentOverlayBuffer: null,
            overlayHeaderArray: [
                {
                    text: "Name",
                    align: "start",
                    value: "name",
                },
                { text: "Display Position", value: "display-position" },
                { text: "Capture Position", value: "capture-position" },
                { text: "Actions", value: "actions", sortable: false },
            ],
        };
    },
});
</script>

<template>
    <v-container id="container">
        <v-row no-gutters class="w-100 mt-5">
            <v-col>
                <v-subheader class="pl-0 pb-5">Overlays:</v-subheader>
            </v-col>
            <v-col class="d-flex justify-end">
                <span class="clicker" @click="createNewOverlay">
                    <v-icon>mdi-plus-circle-outline</v-icon>
                </span>
            </v-col>
        </v-row>
        <v-row no-gutters class="w-100 mt-5">
            <v-data-table
                :headers="overlayHeaderArray"
                :items="this.localOverlayArray"
                item-key="id"
                hide-default-footer
                class="elevation-1 w-100"
            >
                <template v-slot:[`item.display-position`]="{ item }">
                    <span>{{
                        `(${item.displayRectangle.startX}, ${item.displayRectangle.startY}, ${item.displayRectangle.endX}, ${item.displayRectangle.endY})`
                    }}</span>
                </template>

                <template v-slot:[`item.capture-position`]="{ item }">
                    <span>{{
                        `(${item.captureRectangle.startX}, ${item.captureRectangle.startY}, ${item.captureRectangle.endX}, ${item.captureRectangle.endY})`
                    }}</span>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-container class="d-flex">
                        <v-icon small class="clicker" @click="editOverlay(item)"> mdi-pencil-outline </v-icon>
                        <v-icon small class="clicker ml-auto" @click="confirmDeleteOverlay(item)">
                            mdi-delete-outline
                        </v-icon>
                    </v-container>
                </template>
            </v-data-table>
        </v-row>
        <SettingsOverlayEditComponent
            v-if="currentOverlayBuffer"
            :overlay="currentOverlayBuffer"
            :key="currentOverlayBuffer.id"
            :dialog.sync="displayEditDialog"
            @cancel-dialog="cancelEditOverlay"
            @save-dialog="saveEditOverlay"
        />
        <ConfirmDialogComponent
            :dialog.sync="displayConfirmDialog"
            @cancel-dialog="cancelDeleteOverlay"
            @confirm-dialog="deleteOverlay"
        />
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
