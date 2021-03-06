import Vue from "vue";
import App from "./frontend/App.vue";
import "./backend/register-service-worker";
import router from "./frontend/router";
import store from "./frontend/store";
import vuetify from "./frontend/plugins/vuetify";

Vue.config.productionTip = false;
new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount("#app");
