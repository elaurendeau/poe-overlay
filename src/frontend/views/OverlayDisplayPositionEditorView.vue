<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "OverlayDisplayPositionEditorView",
    data() {
        return {
            localDisplayPositionEditorColor: "#00F8FF38",
        };
    },
    mounted() {
        window.api.receive("change-settings-overlay-position-editor", (event, data) => {
            console.log(`Back.ipc -> change-settings-overlay-position-editor '${JSON.stringify(data)}'`);

            this.localDisplayPositionEditorColor = data.displayPositionEditorColor;
        });
    },
});
</script>

<template>
    <v-container
        id="global-container"
        class="w-100 h-100"
        :style="{ 'background-color': localDisplayPositionEditorColor }"
        fluid
    >
    </v-container>
</template>

<style scoped lang="sass">
*
    padding: 0
    margin: 0

#global-container
    -webkit-app-region: drag
</style>
