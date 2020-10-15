import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Rotation from "@/components/Global/Rotation.vue";

Vue.config.productionTip = false;

Vue.component("rotation", Rotation);

Vue.filter("datetime", function(value: Date | string | null) {
  if (!value) return "";
  let datetime = value;
  if (typeof value == "string") datetime = new Date(value);
  return datetime.toLocaleString("en");
});

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
