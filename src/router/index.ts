import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import SettingsView from "@/views/SettingsView.vue";
import OverlayView from "@/views/OverlayView.vue";
import GridView from "@/views/GridView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "overlay",
    component: OverlayView,
  },
  {
    path: "/settings",
    name: "settings",
    component: SettingsView,
  },
  {
    path: "/grid",
    name: "grid",
    component: GridView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
