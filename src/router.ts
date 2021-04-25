import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Scan from "./views/scanning/Scanning.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Scan
    },
    {
      path: "/about",
      name: "about",
      component: () =>
        import("./views/About.vue")
    }
  ]
});
