<script setup lang="ts">
import { is_mobile } from "@/services/util/util";
import { getSearchParamValue } from "@/services/util/url";
import request from "@/services/api";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import Index from "./views/index.vue";

const { domain, token } = storeToRefs(appStore.authStore);

const { setToken} = appStore.authStore;
const { setSpaceKey,getSpaceList } = appStore.spaceStore;
// onBeforeMount(() => {

// });
onBeforeMount(() => {
  window.addEventListener("message", handle, false);
  const search = window.location.search
    ? window.location.search.split("?")[1]
    : window.location.hash.split("?")[1];
  let token = "";
  if (getSearchParamValue(search, "token")) {
    token = getSearchParamValue(search, "token") as string;
  } else if (localStorage.getItem("token")) {
    token = localStorage.getItem("token") as string;
  }
  // let url = window.location.href;
  //自动切换为https
  // if (url.indexOf("http://localhost") === -1 && url.indexOf("https") < 0) {
  //   url = url.replace("http:", "https:");
  //   window.location.replace(url);
  // }
  if (token) {
    request.setToken(token);
    setToken(token);
    setSpaceKey(
      localStorage.getItem("spaceKey") &&
        localStorage.getItem("spaceKey") != "undefined"
        ? localStorage.getItem("spaceKey")
        : ""
    );
  }
});
onUnmounted(() => {
  window.removeEventListener("message", handle, false);
});

const handle = (e: any) => {
  if (
    e.origin === "https://account.qingtime.cn" &&
    e.data.eventName === "redirect"
  ) {
    const token = getSearchParamValue(
      e.data.data.split("?")[1],
      "token"
    ) as string;
    request.setToken(token);
    setToken(token);
  }
};
//初始化
watch(
  token,
  ( newToken) => {
    if (newToken) {
      getSpaceList();
    }
  },
  { immediate: true }
);
</script>

<template><router-view></router-view></template>

<style lang="scss">
#app {
}
*::-webkit-scrollbar {
  width: 2px;
  height: 8px;
}

*::-webkit-scrollbar-thumb {
  background: $commonColor;
  border-radius: 100px;
}
.common-color {
  color: $commonColor !important;
}
.info-nav {
  height: 40px;
  margin: 20px 0px;
  @include flex(null, center, null);
}
</style>
