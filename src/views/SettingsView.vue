<template style="background-color: transparent">
  <div
    style="
      height: 100vh;
      width: 100vw;
      background-color: #041c32;
      border: 0.5px solid #064663;
      border-radius: 20px;
    "
  >
    <div
      style="
        /*calc(x, y) x-> parent border radius, y -> parent border size*/
        border-radius: calc(20px - 0.5px);
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        border-bottom: 0.5px solid #064663;
        height: 5%;
        background-color: #04293a;
        -webkit-app-region: drag;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 1rem;
        align-items: center;
      "
    >
      <div></div>
      <div
        style="
          -webkit-user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
        "
      >
        Settings
      </div>
      <div
        style="
          padding: 5px;
          margin-right: 20px;
          font-size: 1.2em;
          -webkit-user-select: none;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        "
      >
        <div style="-webkit-app-region: no-drag">&#10006;</div>
      </div>
    </div>

    <div></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "SettingsView",
});
</script>
