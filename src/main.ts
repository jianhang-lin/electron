import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import axios from "axios";
import VueAxios from "vue-axios";

import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false;
Vue.prototype.baseURL = "http://www.sz-tech.cn:9090/sunwinmes";
Vue.use(VueAxios, axios);
Vue.use(Antd);
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
