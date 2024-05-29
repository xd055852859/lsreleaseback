import axios from "axios";
import router from "@/router";
// import i18n from "@/language/i18n";
import qs from "qs";
import { setMessage } from "./util/common";
import { commonStore } from "@/store/common";
import { storeToRefs } from "pinia";
import appStore from "@/store";
const AUTH_URL = import.meta.env.VITE_AUTH_URL;
const API_URL = import.meta.env.VITE_BACK_URL;
let token = localStorage.getItem("token") || "";
let domainKey = "";
let regionCode = "";
axios.interceptors.request.use(
  (config: any) => {
    if (config.url.indexOf("upTokenQiniu/getQiNiuUpToken") === -1&&config.url.indexOf("https://nodeserver.qingtime.cn/upload") === -1) {
      if (config.method === "get") {
        if (!config.params) {
          config.params = {};
        }
        config.params.token = token;
        if(config.params&&!config.params.clientKey) {
          config.params.clientKey = domainKey;
        }
      } else {
        let data = qs.parse(config.data);
        data.token = token;
        config.data = {
          token: token,
          clientKey:domainKey,
          ...data,
        };
      }
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (response.data.status === 701) {
      setMessage("error", "请登录");
      localStorage.clear();
      router.replace("/");
      token = "";
      commonStore().clearStore();
    } else if (
      response.data.status !== 200 &&
      response.data.statusCode !== "200" &&
      response.data.status !== 202 &&
      response.data.statusCode !== "202"
    ) {
      setMessage("error", response.data.msg);
    } else {
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const request = {
  get(path: string, params?: object, otherUrl?: boolean, otherPath?: string) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: "get",
          url: otherPath
            ? otherPath
            : otherUrl
            ? AUTH_URL + path
            : API_URL + path,
          params: params,
          headers: {
            token: token,
          },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },
  post(path: string, params?: object) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: "post",
          url: API_URL + path,
          data: params,
          headers: {
            token: token,
          },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },
  patch(path: string, params?: object) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: "patch",
          url: API_URL + path,
          data: params,
          headers: {
            token: token,
          },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },
  delete(path: string, params?: object) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: "delete",
          url: API_URL + path,
          data: params,
          headers: {
            token: token,
          },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },
};

export default {
  request,
  setToken: (_token: string) => {
    token = _token;
  },
  setDomainKey: (_domainKey: string) => {
    domainKey = _domainKey;
  },
  setRegionCode: (_regionCode: string) => {
    regionCode = _regionCode;
  },
};
