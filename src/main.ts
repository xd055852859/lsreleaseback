import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { Quasar, Notify, AppVisibility, Dialog, Loading } from "quasar";
import { createPinia } from "pinia";
import { registerStore } from "@/store";
import router from "@/router";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import weekday from "dayjs/plugin/weekday";
import dayjs from "dayjs";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import langDe from "quasar/lang/zh-CN";
import "./styles/common/common.scss";

// import "amfe-flexible/index.js";
// Import Quasar css
import "quasar/src/css/index.sass";
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

dayjs.extend(weekday);
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.locale("zh-cn");
app.provide("dayjs", dayjs);
pinia.use(({ store }) => {
  const initialState = JSON.parse(JSON.stringify(store.$state));
  store.$reset = () => {
    store.$state = JSON.parse(JSON.stringify(initialState));
  };
});
app
  .use(router)
  .use(pinia)
  .use(Quasar, {
    lang: langDe,
    plugins: {
      Notify,
      AppVisibility,
      Dialog,
      Loading,
    },
    config: {
      notify: {
        /* look at QuasarConfOptions from the API card */
      },
      brand: {
        // primary: "#ff0000",
        // ...
      },
      loading: {
        /* look at QuasarConfOptions from the API card */
      },
    },
  });
registerStore();
app.mount("#app");
