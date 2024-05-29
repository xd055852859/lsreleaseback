<script setup lang="ts">
import { storeToRefs } from "pinia";
import appStore from "@/store";
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
interface Region {
  _key: string;
  name: string;
  areaCode: string;
  level: number;
}
const props = defineProps<{
  regionCode: string;
  regionArr?: any;
  clearState?: boolean;
}>();
const { spaceInfo } = storeToRefs(appStore.spaceStore);
const emits = defineEmits<{
  (e: "setCode", obj: any, code: string): void;
  (e: "clearCode"): void;
}>();
const rootKey = ref<string>("");
const provinceArray = ref<Region[]>([]);
const cityArray = ref<Region[]>([]);
const districtArray = ref<Region[]>([]);
const townArray = ref<Region[]>([]);
const villageArray = ref<Region[]>([]);
const provinceCode = ref<Region | null>(null);
const cityCode = ref<Region | null>(null);
const districtCode = ref<Region | null>(null);
const townCode = ref<Region | null>(null);
const villageCode = ref<Region | null>(null);
onMounted(() => {
  if (props.regionArr) {
    villageCode.value = props.regionArr.villageCode;
    townCode.value = props.regionArr.townCode;
    districtCode.value = props.regionArr.districtCode;
    cityCode.value = props.regionArr.cityCode;
  }
});
const getRegion = async (level: number, code: string) => {
  const regionRes = (await api.request.get("regionCode/subByCode", {
    code: code,
  })) as ResultProps;
  if (regionRes.msg === "OK") {
    switch (level) {
      case 1:
        cityArray.value = [...regionRes.data];
        cityCode.value = null;
        districtCode.value = null;
        townCode.value = null;
        villageCode.value = null;
        break;
      case 2:
        districtArray.value = [...regionRes.data];
        districtCode.value = null;
        townCode.value = null;
        villageCode.value = null;
        break;
      case 3:
        townArray.value = [...regionRes.data];
        townCode.value = null;
        villageCode.value = null;
        break;
      case 4:
        villageArray.value = [...regionRes.data];
        villageCode.value = null;
        break;
    }
    // emits("setCode", code);
  }
};
const clearRegion = () => {
  cityCode.value = null;
  townCode.value = null;
  districtCode.value = null;
  villageCode.value = null;
  cityArray.value = [];
  districtArray.value = [];
  townArray.value = [];
  villageArray.value = [];
  emits("clearCode");
};
watch(
  [() => props.regionCode, spaceInfo],
  ([code, info]) => {
    if (code === info?.regionCode) {
      getRegion(info.level, code);
    }
  },
  { immediate: true }
);
watchEffect(() => {
  let obj: any = {};
  if (villageCode.value) {
    obj.villageCode = villageCode.value;
  }
  if (townCode.value) {
    obj.townCode = townCode.value;
  }
  if (districtCode.value) {
    obj.districtCode = districtCode.value;
  }
  if (cityCode.value) {
    obj.cityCode = cityCode.value;
  }
  if (JSON.stringify(obj) !== "{}") {
    emits(
      "setCode",
      obj,
      villageCode.value
        ? villageCode.value.areaCode
        : townCode.value
        ? townCode.value.areaCode
        : districtCode.value
        ? districtCode.value.areaCode
        : cityCode.value
        ? cityCode.value.areaCode
        : props.regionCode
        ? props.regionCode
        : ""
    );
  }
});
</script>
<template>
  <q-select
    outlined
    label="所属市"
    placeholder="请选择市"
    v-model="cityCode"
    :options="cityArray"
    :option-label="(opt) => opt.name"
    dense
    @update:model-value="(val) => getRegion(2, val.areaCode)"
    v-if="spaceInfo?.level < 2"
    style="width: 150px"
    class="q-mr-sm"
  />
  <q-select
    outlined
    label="所属区县"
    placeholder="请选择区县"
    v-model="districtCode"
    :options="districtArray"
    :option-label="(opt) => opt.name"
    dense
    @update:model-value="(val) => getRegion(3, val.areaCode)"
    v-if="spaceInfo?.level < 3"
    style="width: 150px"
    class="q-mr-sm"
  />
  <q-select
    outlined
    label="所属乡镇"
    placeholder="请选择乡镇"
    v-model="townCode"
    :options="townArray"
    :option-label="(opt) => opt.name"
    dense
    @update:model-value="(val) => getRegion(4, val.areaCode)"
    v-if="spaceInfo?.level < 4"
    style="width: 150px"
    class="q-mr-sm"
  />
  <q-select
    outlined
    label="所属村"
    placeholder="请选择村"
    v-model="villageCode"
    :option-label="(opt) => opt.name"
    :options="villageArray"
    dense
    v-if="spaceInfo?.level < 5"
    style="width: 150px"
  />
  <q-icon
    name="cancel"
    size="24px"
    @click="clearRegion()"
    color="grey-6 q-ml-sm"
    v-if="clearState && (cityCode || townCode || districtCode || villageCode)"
  />
</template>
<style scoped lang="scss"></style>
<style lang="scss"></style>
