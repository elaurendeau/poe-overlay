<template>
    <v-container id="container" fluid> test</v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "OverlayView",
});
</script>

<style scoped lang="sass">
*
    padding: 0
    margin: 0

#container
    width: 100vw
    height: 10px
    background-color: violet
</style>
