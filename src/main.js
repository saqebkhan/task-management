import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "@/router";
import "./index.css";
import "@/components/LogIn/Authentication.js";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia).use(router).mount("#app");
