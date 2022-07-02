<template>
  <v-app style="background-color: transparent">
    <Overlay />
  </v-app>
</template>

<script>
import Overlay from "@/components/Overlay";

export default {
  name: "App",
  // eslint-disable-next-line vue/no-unused-components
  components: { Overlay },
  data: () => ({
    //
  }),
};
</script>
