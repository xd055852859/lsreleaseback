<script setup lang="ts">
import _ from "lodash";

import { useQuasar } from "quasar";
import { DataInterface } from "./index.vue";
import { setMessage, commonSave, setLoading } from "@/services/util/common";
import cEditor from "@/components/editor/cEditor.vue";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
const { spaceInfo } = storeToRefs(appStore.spaceStore);
const dayjs: any = inject("dayjs");
const $q = useQuasar();
const props = defineProps<{
  info: DataInterface | null;
}>();
const emits = defineEmits<{
  updateData: [info: DataInterface];
  close;
}>();
const editorRef = ref<any>(null);
const info = reactive<DataInterface>({
  _key: "",
  industry: "农",
  type: "新闻",
  title: "",
  summary: "",
  cover: "",
  content: null,
});
const baseInfo = ref<DataInterface | null>(null);
onMounted(() => {
  baseInfo.value = _.cloneDeep(info);
  if (props.info?._key) {
    getInfo(props.info?._key);
  }
});
const getInfo = async (key) => {
  if (key) {
    let dataRes = (await api.request.get("news/detail", {
      newsKey: key,
    })) as ResultProps;
    if (dataRes.msg === "OK") {
      Object.assign(info, dataRes.data);
    }
  } else {
    Object.assign(info, baseInfo.value);
  }
};

const saveInfo = () => {
  let newInfo = { ...info };
  let content = null;
  if (editorRef.value.handlePost()) {
    console.log(editorRef.value.handlePost());
    [
      //@ts-ignore
      newInfo.title,
      content,
      newInfo.summary,
      newInfo.cover,
    ] = editorRef.value.handlePost();
  } else if (!editorRef.value.handlePost() && !newInfo.content) {
    setMessage("error", "请输入文章内容");
    return;
  }

  //@ts-ignore
  newInfo.clientKey = spaceInfo.value._key;
  setLoading(true);
  commonSave("news", "newsKey", { ...newInfo, content: content }, () => {
    setLoading(false);
    emits("updateData", newInfo);
    emits("close");
  });
};
</script>
<template>
  <div class="form news-form">
    <div class="form-text-title">
      <q-select
        outlined
        dense
        class="q-mr-sm"
        v-model="info.type"
        :options="['新闻', '政策']"
        style="width: 150px"
      />
      <q-select
        outlined
        dense
        v-model="info.industry"
        :options="['农', '林', '牧', '渔','文旅']"
        style="width: 150px"
      />
    </div>
    <div class="form-text-content">
      <c-editor ref="editorRef" :initData="info.content" />
    </div>
  </div>
  <div class="row justify-end items-center">
    <q-btn
      flat
      color="grey-5"
      label="取消"
      @click="emits('close')"
      class="q-mr-sm"
    />
    <q-btn color="primary" label="确认" @click="saveInfo" />
  </div>
</template>
<style scoped lang="scss">
.news-form {
  height: calc(100vh - 120px);
  .form-text-title {
    width: 100%;
    height: 50px;
    @include flex(flex-start, center, null);
  }
  .form-text-content {
    width: 100%;
    height: calc(100% - 90px);
    border: 1px solid #bebebf;
    border-radius: 5px;
    margin: 10px 0px;
    @include scroll();
  }
}
</style>
<style lang="scss"></style>
