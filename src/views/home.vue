<script setup lang="ts">
import appStore from "@/store";
import { storeToRefs } from "pinia";
import router from "@/router";
import request from "@/services/api";
import cIcon from "@/components/common/cIcon.vue";
const { spaceList, spaceInfo } = storeToRefs(appStore.spaceStore);
const { clearStore } = appStore.commonStore;
const { setSpaceKey } = appStore.spaceStore;
const { setToken, setUserInfo } = appStore.authStore;
const spaceMenuVisible = ref<boolean>(false);
const logout = () => {
  router.replace("/");
  localStorage.removeItem("token");
  request.setToken("");
  setToken("");
  setUserInfo(null);
  clearStore();
};
</script>
<template>
  <div class="home">
    <div class="left">
      <div class="left-title">两山大屏后台系统</div>
      <div class="left-subtitle" style="width: 100%; height: 45px">
        <q-avatar
          :color="spaceInfo?.logo ? '#fff' : 'primary'"
          rounded
          size="sm"
        >
          <img v-if="spaceInfo?.logo" :src="spaceInfo.logo" />
          <template v-else-if="spaceInfo?.name">
            <div class="text-white">
              {{ spaceInfo.name.substring(0, 1) }}
            </div>
          </template>
          <img v-else src="/common/defaultGroup.png" />
        </q-avatar>

        <div class="single-to-long left-subtitle-name">
          {{ spaceInfo?.name }}
        </div>
        <q-icon name="keyboard_arrow_down" size="28px" color="grey-6" />
        <!--   @mouseleave="spaceMenuVisible = false" -->
        <q-menu
          style="width: 280px; padding: 10px; max-height: 70vh"
          v-model="spaceMenuVisible"
        >
          <q-list class="q-mb-md left-space-item">
            <q-item
              v-for="(item, index) in spaceList"
              :key="`space${index}`"
              clickable
              v-close-popup
              class="left-space-title dp--center q-px-xs q-py-xs"
              @click="setSpaceKey(item._key)"
            >
              <div style="width: calc(100% - 40px)">
                <q-avatar
                  rounded
                  :color="item?.logo ? '#fff' : 'primary'"
                  size="sm"
                  class="q-mr-sm"
                >
                  <img v-if="item?.logo" :src="item.logo" />

                  <template v-else-if="item?.name">
                    {{ item.name.substring(0, 1) }}
                  </template>
                  <img v-else src="/common/defaultGroup.png" /> </q-avatar
                >{{ item.name }}
              </div>
              <q-space />
            </q-item>
          </q-list>

          <div class="row justify-end items-center q-mt-sm">
            <q-btn flat label="退出登录" color="grey-5" @click="logout" />
          </div>
        </q-menu>
      </div>
      <q-list>
        <q-item :to="{ name: 'resource' }" exact class="left-menu-item">
          <q-item-section avatar class="left-menu-avatar">
            <q-icon name="sym_o_forest" />
          </q-item-section>
          <q-item-section class="left-menu-title">生态资源</q-item-section>
        </q-item>
        <q-item :to="{ name: 'product' }" exact class="left-menu-item">
          <q-item-section avatar class="left-menu-avatar">
            <q-icon name="sym_o_payments" />
          </q-item-section>
          <q-item-section class="left-menu-title">生态产品</q-item-section>
        </q-item>
        <q-item :to="{ name: 'news' }" exact class="left-menu-item">
          <q-item-section avatar class="left-menu-avatar">
            <q-icon name="sym_o_breaking_news" />
          </q-item-section>
          <q-item-section class="left-menu-title">文章管理</q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>
<style scoped lang="scss">
.home {
  width: 100vw;
  height: 100vh;
  @include flex(space-between, center, null);
  .left {
    width: 250px;
    height: 100vh;
    padding: 20px 0px 10px 0px;
    box-sizing: border-box;
    background-color: #f2f3f6;
    box-shadow: 1px 0px 0px 0px #e1e1e1;
    position: relative;
    z-index: 10;
    .left-title {
      width: 100%;
      height: 40px;
      // margin-bottom: 20px;
      text-align: center;
      font-size: 22px;
      // @include flex(flex-start, center, null);
    }
    .left-subtitle {
      width: 100%;
      height: 50px;
      margin-bottom: 10px;
      @include flex(flex-start, center, null);
      @include p-num(0px, 15px);
      .left-subtitle-name {
        width: calc(100% - 60px);
        margin: 0px 10px;
      }
    }
    .left-menu-item {
      .left-menu-title {
        width: 100%;
      }
    }
  }
  .right {
    flex: 1;
    height: 100vh;
    position: relative;
    background-color: #fafafb;
    z-index: 1;
    width: 0;
    // @include p-num(15px, 35px);
  }
}
</style>
<style lang="scss">
.q-item__section--avatar {
  min-width: 20px;
  padding-right: 6px;
}
.q-expansion-item__content {
  padding-left: 20px;
  box-sizing: border-box;
}
.left-menu-item {
  .left-menu-avatar {
    /* prettier-ignore */
    min-width:20px;
    padding-right: 6px;
  }
  .left-common-title {
    // height: 100%;
    font-size: 14px;
    // @include flex(flex-start, center, null);
    // line-height: 40px;
  }
}
</style>
