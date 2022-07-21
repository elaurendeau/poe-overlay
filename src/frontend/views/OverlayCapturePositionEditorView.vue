<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "OverlayCapturePositionEditorView",
    data() {
        return {
            localCapturePositionEditorColor: "#00F8FF38",
        };
    },
    mounted() {
        window.api.receive("change-settings-overlay-position-editor", (event, data) => {
            console.log(`Back.ipc -> change-settings-overlay-position-editor '${JSON.stringify(data)}'`);

            this.localCapturePositionEditorColor = data.capturePositionEditorColor;
        });
    },
});
</script>

<template>
    <v-container
        id="global-container"
        class="w-100 h-100"
        :style="{ 'background-color': localCapturePositionEditorColor }"
        fluid
    >
        <div id="background">CAPTURE</div>
        <div class="vertical-line"></div>
        <div class="horizontal-line"></div>
    </v-container>
</template>

<style scoped lang="sass">
*
    padding: 0
    margin: 0

#global-container
    -webkit-app-region: drag

#background
    text-align: justify
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    z-index: -1
    overflow: hidden

.vertical-line
    position: relative
    width: 0px
    height: 100%
    left: calc(50% - 2px)
    border: 1px dotted black

.horizontal-line
    position: absolute
    width: 100%
    height: 0px
    top: calc(50% - 2px)
    border: 1px dotted black
</style>
