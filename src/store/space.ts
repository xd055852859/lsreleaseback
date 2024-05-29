import { ref } from "vue";
import request from "@/services/api";
import { defineStore } from "pinia";
import _ from "lodash";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { Space, SpaceInfo, SpaceMember } from "@/interface/Space";
import router from "@/router";
// 使用setup模式定义
export const spaceStore = defineStore(
  "spaceStore",
  () => {
    const spaceKey = ref<string>("");
    const spaceList = ref<any>(null);
    const spaceInfo = ref<SpaceInfo | null | any>(null);
    const spaceRole = ref<number>(5);
    const setSpaceKey = (newKey) => {
      spaceKey.value = newKey;
      localStorage.setItem("spaceKey", newKey);
    };
    const getSpaceList = async () => {
      let spaceRes = (await api.request.get("client/userCheck")) as ResultProps;
      if (spaceRes.msg === "OK") {
        spaceList.value = spaceRes.data ? spaceRes.data : [];
      }
    };
    const setSpaceList = async (newList) => {
      spaceList.value = newList;
    };

    const getSpaceInfo = async (key) => {
      let spaceRes = (await api.request.get("client/detail", {
        clientKey: key,
      })) as ResultProps;
      if (spaceRes.msg === "OK") {
        spaceInfo.value = spaceRes.data;
        spaceRole.value = spaceRes.data.role;
        request.setDomainKey(spaceRes.data._key);
        request.setRegionCode(spaceRes.data.regionCode);
        //@ts-ignore
        document.querySelector('link[rel="icon"]').href = spaceRes.data.logo;
        document.title = spaceRes.data.name;
      }
    };
    const setSpaceInfo = (newInfo) => {
      spaceInfo.value = newInfo;
    };

    watch(spaceKey, (newKey) => {
      if (newKey) {
        getSpaceInfo(newKey);
      }
    });
    return {
      spaceKey,
      setSpaceKey,
      spaceRole,
      spaceInfo,
      setSpaceInfo,
      getSpaceInfo,
      spaceList,
      setSpaceList,
      getSpaceList,
    };
  }
  // {
  //   persist: {
  //     storage: window.sessionStorage,
  //     // 部分持久化状态的点符号路径数组，[]意味着没有状态被持久化(默认为undefined，持久化整个状态)
  //     // paths: ['nested.data'],
  //   },
  // }
);
