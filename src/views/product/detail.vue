<script setup lang="ts">
import MapMenu from "@/components/mapMenu.vue";
import cDialog from "@/components/common/cDialog.vue";
import cImage from "@/components/common/cImage.vue";
import { DataInterface } from "./index.vue";
import SelectRegion from "@/components/selectRegion.vue";
import { setMessage, commonSave, setLoading } from "@/services/util/common";
import _ from "lodash";
import { uploadFile } from "@/services/util/file";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
const dayjs: any = inject("dayjs");
const props = defineProps<{
  info: DataInterface | null;
  tagList?: any;
  tagTree?: any;
}>();
const emits = defineEmits<{
  updateData: [info: DataInterface];
  close;
}>();
const { spaceInfo } = storeToRefs(appStore.spaceStore);
const inputRef = ref<HTMLElement | null>(null);
const tagVisible = ref<boolean>(false);
const info = reactive<DataInterface>({
  _key: "",
  name: "",
  type: "农",
  regionCode: spaceInfo.value.regionCode,
  regionArr: null,
  address: "",
  location: null,
  imageList: [],
  production: 0,
  productionUnit: "",
  describe: "",
  status: 0,
  isStatus: false,
  keyProduct: false,
  area: 0,
  areaUnit: "",
  orderAmount: 0,
  orderUnit: "",
  transactionAmount: 0,
  transactionUnit: "",
  owner: "",
  contact: "",
  contactAddress: "",
  detailAddress: "",
});
const baseInfo = ref<DataInterface | null>(null);
onMounted(() => {
  baseInfo.value = _.cloneDeep(info);
  if (props.info?._key) {
    getInfo(props.info?._key);
  }
});
const locationVisible = ref<boolean>(false);
const getInfo = async (key) => {
  if (key) {
    let dataRes = (await api.request.get("product/detail", {
      productKey: key,
    })) as ResultProps;
    if (dataRes.msg === "OK") {
      dataRes.data.isStatus = !!dataRes.data.status;
      Object.assign(info, dataRes.data);
    }
  } else {
    Object.assign(info, baseInfo.value);
  }
};
const uploadImage = (file, type) => {
  let mimeType = ["image/*"];
  if (file) {
    uploadFile(file, mimeType, async (url, name) => {
      switch (type) {
        case "base":
          info.imageList.push(url);
          break;
      }
    });
  }
};
const saveInfo = () => {
  if (!info.name) {
    setMessage("error", "请输入产品名称");
    return;
  }
  if (info.regionCode === spaceInfo.value.regionCode) {
    setMessage("error", "请选择所属行政区");
    return;
  }
  let newInfo = { ...info };
  newInfo.area = +newInfo.area;
  newInfo.status = +newInfo.isStatus;
  setLoading(true);
  commonSave("product/back", "productKey", newInfo, (data) => {
    setLoading(false);
    console.log(data);
    emits("updateData", data);
    emits("close");
  });
};
const setLocation = (
  lo: number,
  la: number,
  center: number[],
  zoom: number
) => {
  info.location = [lo, la];
};
</script>
<template>
  <div class="form product-form">
    <q-list bordered>
      <q-expansion-item label="基本信息" group="product" default-opened>
        <q-card>
          <div class="form-box product-form-box">
            <div class="form-item">
              <div class="form-item-title">是否上架</div>
              <div class="form-item-input">
                <q-toggle v-model="info.isStatus" />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">是否重点产品</div>
              <div class="form-item-input">
                <q-toggle v-model="info.keyProduct" />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">
                产品类型<span class="text-red q-ml-sm text-h6">*</span>
              </div>
              <div class="form-item-input">
                <q-select
                  v-model="info.type"
                  :options="['农', '林', '牧', '渔']"
                  dense
                  class="full-width q-pb-none"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">
                产品名称<span class="text-red q-ml-sm text-h6">*</span>
              </div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.name"
                  required
                  placeholder="请输入产品名称"
                  :rules="[(val) => !!val || '产品名称必填']"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">
                所属行政区<span class="text-red q-ml-sm text-h6">*</span>
              </div>
              <div class="form-item-input">
                <template v-if="info._key">
                  {{
                    info.regionArr
                      ? `${
                          info.regionArr.cityCode
                            ? info.regionArr.cityCode.name
                            : ""
                        } ${
                          info.regionArr.districtCode
                            ? info.regionArr.districtCode.name
                            : ""
                        } ${
                          info.regionArr.townCode
                            ? info.regionArr.townCode.name
                            : ""
                        } ${
                          info.regionArr.villageCode
                            ? info.regionArr.villageCode.name
                            : ""
                        }`
                      : ""
                  }}
                </template>
                <SelectRegion
                  :regionCode="info.regionCode"
                  :regionArr="info.regionArr"
                  @setCode="
                    (obj, code) => {
                      info.regionArr = obj;
                      info.regionCode = code;
                    }
                  "
                  v-else
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">产地</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.address"
                  placeholder="请输入位置信息"
                  class="full-width q-pb-none"
                />
              </div>
            </div>

            <div class="form-item">
              <div class="form-item-title">地理坐标</div>
              <div class="form-item-input icon-point">
                <q-btn
                  color="primary"
                  label="地图选点"
                  v-if="!info.location"
                  @click="locationVisible = true"
                />
                <template v-else>
                  经度:{{ info.location[0] }} , 纬度:{{
                    info.location[1]
                  }}</template
                >
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">产品图片</div>
              <div class="form-item-img">
                <div
                  class="item-img"
                  v-for="(item, index) in info.imageList"
                  :key="`imageDetail${index}`"
                >
                  <q-icon
                    name="cancel"
                    size="18px"
                    class="item-img-close text-white icon-point"
                    @click="info.imageList.splice(index, 1)"
                  />
                  <c-image
                    :src="item"
                    :list="info.imageList"
                    :isPreview="true"
                  />
                </div>
                <div class="upload-button upload-img-button item-img-add">
                  <q-icon name="add" style="color: #ebebeb" size="45px" />
                  <input
                    type="file"
                    accept="image/*"
                    @change="
                      //@ts-ignore
                      uploadImage($event.target.files[0], 'base')
                    "
                    class="upload-img"
                  />
                </div>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">年产量</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.production"
                  placeholder="请输入年产量"
                  class="full-width q-pb-none"
                  type="number"
                  :min="0"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">年产量单位</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.productionUnit"
                  placeholder="请输入年产量单位"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">种植面积</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.area"
                  placeholder="请输入种植面积"
                  class="full-width q-pb-none"
                  type="number"
                  :min="0"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">种植面积单位</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.areaUnit"
                  placeholder="请输入种植面积单位"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">订单额</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.orderAmount"
                  placeholder="请输入订单额"
                  class="full-width q-pb-none"
                  type="number"
                  :min="0"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">订单额单位</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.orderUnit"
                  placeholder="请输入订单额单位"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">交易额</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.transactionAmount"
                  placeholder="请输入交易额"
                  class="full-width q-pb-none"
                  type="number"
                  :min="0"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">交易额单位</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.transactionUnit"
                  placeholder="请输入交易额单位"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">产品描述</div>
              <div class="form-item-box">
                <q-input
                  type="textarea"
                  dense
                  outlined
                  v-model="info.describe"
                  placeholder="请输入产品描述"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
          </div>
        </q-card>
      </q-expansion-item>
      <q-separator />
      <q-expansion-item label="权益信息" group="product">
        <q-card>
          <div class="form-box product-form-box">
            <div class="form-item">
              <div class="form-item-title">权益人/权属单位</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.owner"
                  placeholder="请输入权益人/权属单位"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">联系方式</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.contact"
                  placeholder="请输入联系方式"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">通讯地址</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.contactAddress"
                  placeholder="请输入通讯地址"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">详细地址</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.detailAddress"
                  placeholder="请输入详细地址"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
          </div>
        </q-card>
      </q-expansion-item>
      <q-separator />
    </q-list>
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
  <c-dialog
    :visible="locationVisible"
    title="地图选点"
    @close="locationVisible = false"
    :dialogStyle="{ width: '730px', maxWidth: '800px' }"
    class="dialog-transparent"
  >
    <template #content>
      <MapMenu
        mapId="projectMap"
        :location="info.location"
        :width="700"
        :height="600"
        @setLocation="setLocation"
      />
    </template>
  </c-dialog>
</template>
<style scoped lang="scss">
.product-form {
  height: calc(100% - 50px);
}
.product-form-box {
  height: calc(100vh - 240px);
  padding-bottom: 20px;
  box-sizing: border-box;
  @include scroll();
}
</style>
<style lang="scss"></style>
