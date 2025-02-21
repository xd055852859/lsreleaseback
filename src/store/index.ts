import { authStore } from "@/store/auth";
import { commonStore } from "@/store/common";
import { spaceStore } from "@/store/space";
export interface IAppStore {
  authStore: ReturnType<typeof authStore>;
  commonStore: ReturnType<typeof commonStore>;
  spaceStore: ReturnType<typeof spaceStore>;
}

const appStore: IAppStore = {} as IAppStore;
/**
 * 注册app状态库
 */
export const registerStore = () => {
  appStore.authStore = authStore();
  appStore.commonStore = commonStore();
  appStore.spaceStore = spaceStore();
};

export default appStore;
