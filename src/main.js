import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import { createPinia } from "pinia";

const app = createApp(App);

app.use(router);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(createPinia());

app.mount("#app");
