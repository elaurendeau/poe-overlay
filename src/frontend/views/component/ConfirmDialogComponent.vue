<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    name: "ConfirmDialogComponent",
    props: {
        editedId: Number,
        dialog: Boolean,
    },
    methods: {
        cancel() {
            this.$emit("cancel-dialog");
        },
        confirm() {
            this.$emit("confirm-dialog");
        },
    },
});
</script>

<template>
    <v-dialog :value="dialog" @input="$emit('input', $event)" max-width="500px" persistent>
        <v-card>
            <v-card-title>Confirm</v-card-title>
            <v-card-text>Are you sure you want to proceed?</v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn @click="confirm">Confirm</v-btn>
                <v-btn @click="cancel">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
