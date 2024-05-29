import appStore from "@/store";
import { storeToRefs } from "pinia";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/login.vue"),
    children: [],
  },
  {
    path: "/space",
    name: "space",
    component: () => import("@/views/space.vue"),
    children: [],
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/home.vue"),
    redirect: { name: "resource" },
    children: [
      {
        path: "resource",
        name: "resource",
        component: () => import("@/views/resource/index.vue"),
        children: [],
      },
      {
        path: "product",
        name: "product",
        component: () => import("@/views/product/index.vue"),
        children: [],
      },
      {
        path: "news",
        name: "news",
        component: () => import("@/views/news/index.vue"),
        children: [],
      },
    ],
  },

  // {
  //   path: "/phone",
  //   name: "phone",
  //   component: () => import("@/views/phone/home.vue"),
  //   redirect: "/phone/resource",
  //   children: [
  //     {
  //       path: "news",
  //       name: "phoneNews",
  //       component: () => import("@/views/phone/news.vue"),
  //       children: [],
  //     },
  //     {
  //       path: "circle",
  //       name: "phoneCircle",
  //       component: () => import("@/views/phone/circle.vue"),
  //       children: [],
  //     },
  //     {
  //       path: "resource",
  //       name: "phoneResource",
  //       component: () => import("@/views/phone/resource.vue"),
  //       children: [],
  //     },
  //     {
  //       path: "environment",
  //       name: "phoneEnvironment",
  //       component: () => import("@/views/phone/environment.vue"),
  //       children: [],
  //     },
  //     {
  //       path: "userCenter",
  //       name: "phoneUserCenter",
  //       component: () => import("@/views/phone/userCenter.vue"),
  //       children: [],
  //     },
  //     {
  //       path: "resourceList/:id",
  //       name: "phoneResourceList",
  //       component: () => import("@/views/phone/resourceList.vue"),
  //       children: [],
  //     },
  //   ],
  // },
];
const routerHistory = createWebHashHistory();
const router = createRouter({
  history: routerHistory,
  routes,
});
//全局前置守卫
// 全局导航守卫
export default router;
