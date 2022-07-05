<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "GridView",
});
</script>

<template>
  <div id="settings-frame">
    <div id="settings-header">
      <div></div>
      <div id="settings-title">Settings</div>
      <div id="close-section">
        <div id="close-button">&#10006;</div>
      </div>
    </div>

    <div id="settings-content"></div>
  </div>
</template>

<style lang="sass">
body, html
  margin: 0
  padding: 0

*
  box-sizing: border-box
  font-family: "Segoe UI"
  color: white

body
  background-color: transparent

#settings-frame
  height: 100vh
  width: 100vw
  background-color: #041C32
  border: 0.5px solid #064663
  border-radius: 20px

#settings-header
  /*calc(x, y) x-> parent border radius, y -> parent border size*/
  border-radius: calc(20px - 0.5px)
  border-bottom-right-radius: 0
  border-bottom-left-radius: 0
  border-bottom: 0.5px solid #064663
  height: 5%
  background-color: #04293A
  -webkit-app-region: drag
  display: grid
  grid-template-columns: 1fr 1fr 1fr
  grid-gap: 1rem
  align-items: center

  *
    height: 100%

#settings-title
  -webkit-user-select: none
  display: flex
  align-items: center
  justify-content: center
  font-weight: bold
  font-size: 16px

#close-section
  padding: 5px
  margin-right: 20px
  font-size: 1.2em
  -webkit-user-select: none
  display: flex
  align-items: center
  justify-content: flex-end

#close-button
  -webkit-app-region: no-drag

#close-button:hover
  color: #EC625F
</style>
