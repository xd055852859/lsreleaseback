import { ref } from "vue";
import { defineStore } from "pinia";
import { authStore } from "./auth";
import { spaceStore } from "./space";

// 使用setup模式定义
export const commonStore = defineStore("commonStore", () => {
  const lng = ref<number>(0);
  const lat = ref<number>(0);
  const tabType = ref<number>(
    parseInt(localStorage.getItem("tabType") as string) ?? 0
  );
  const el = ref(null);
  

  const setLocation = (newLng, newLat) => {
    lat.value = newLat;
    lng.value = newLng;
  };
  const setTabType = (newTabType) => {
    tabType.value = newTabType;
    localStorage.setItem("tabType", newTabType + "");
  };
  const clearStore = () => {
    authStore().$reset();
    spaceStore().$reset();
  };
  return {

    lng,
    lat,
    setLocation,
    tabType,
    setTabType,
    clearStore
  };
});
