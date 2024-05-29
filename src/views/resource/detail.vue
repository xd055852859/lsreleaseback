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
  tagKey: "",
  status: 0,
  isStatus: false,
  area: 0,
  areaUnit: "平方米",
  waterArea:0,
  regionCode: spaceInfo.value.regionCode,
  regionArr: null,
  address: "",
  location: null,
  imageList: [],
  conversionProof:[],
  unused: false,
  valuation: 0,
  describe: "",
  owner: "",
  ownerCode: "",
  proof: [],
  propertyID: "",
  contact: "",
  purpose: "",
  propertyStatus: 1,
  propertyNature: 1,
  propertyType: 1,
  contactAddress: "",
  detailAddress: "",
  investmentProject: false,
  keyProject: false,
  investmentObjective: ["", "", ""],
  investmentAmount: "",
  operatingRent: "",
  targetAmount: "",
  plannedStartDate: null,
  plannedEndDate: null,
  projectSummary: "",
  hasConverted:false
});
const baseInfo = ref<DataInterface | null>(null);
const locationVisible = ref<boolean>(false);
onMounted(() => {
  baseInfo.value = _.cloneDeep(info);
  if (props.info?._key) {
    getInfo(props.info?._key);
  }
});

const getInfo = async (key: string) => {
  if (key) {
    let dataRes = (await api.request.get("ecoResource/detail", {
      resourceKey: key,
    })) as ResultProps;
    if (dataRes.msg === "OK") {
      dataRes.data.isStatus = !!dataRes.data.status;

      Object.assign(info, dataRes.data);
      if (dataRes.data.plannedStartDate) {
        info.plannedStartDate = dayjs(dataRes.data.plannedStartDate).format(
          "YYYY-MM-DD"
        );
      }
      if (dataRes.data.plannedEndDate) {
        info.plannedEndDate = dayjs(dataRes.data.plannedEndDate).format(
          "YYYY-MM-DD"
        );
      }
    }
  } else {
    Object.assign(info, baseInfo.value);
  }
};
const uploadImage = (file, type) => {
  let mimeType = ["image/*"];
  if (file) {
    uploadFile(file, type==="conversion"?["*"]:mimeType, async (url, name) => {
      switch (type) {
        case "base":
          info.imageList.push(url);
          break;
        case "message":
          info.proof.push(url);
          break;
        case "conversion":
          info.conversionProof.push(url);
          break;
      }
    });
  }
};
const saveInfo = () => {
  if (!info.name) {
    setMessage("error", "请输入资源名称");
    return;
  }
  if (!info.tagKey) {
    setMessage("error", "请选择资源类型");
    return;
  }
  if (info.regionCode === spaceInfo.value.regionCode) {
    setMessage("error", "请选择所属行政区");
    return;
  }
  let newInfo = { ...info };
  newInfo.area = +newInfo.area;
  //@ts-ignore
  newInfo.resourceKey = newInfo._key;
  newInfo.status = +newInfo.isStatus;
  newInfo.plannedStartDate = dayjs(newInfo.plannedStartDate).valueOf();
  newInfo.plannedEndDate = dayjs(newInfo.plannedEndDate).valueOf();
  if(!newInfo.investmentProject){
    newInfo.hasConverted=false
  }
  setLoading(true);
  commonSave("ecoResource/back", "resourceKey", newInfo, () => {
    setLoading(false);
    console.log(newInfo);
    emits("updateData", newInfo);
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
  <div class="form resource-form">
    <q-list bordered>
      <q-expansion-item label="基本信息" group="resource" default-opened>
        <q-card>
          <div class="form-box resource-form-box">
            <div class="form-item">
              <div class="form-item-title">
                资源类型<span class="text-red q-ml-sm text-h6">*</span>
              </div>
              <div class="form-item-input" ref="inputRef">
                <div class="form-item-select icon-point">
                  {{ tagTree[info.tagKey]?.name }}
                  <q-icon
                    name="arrow_drop_down"
                    color="grey-7"
                    style="margin-left: 8px"
                    size="25px"
                    class="select-icon"
                  />
                </div>
                <q-menu
                  :style="{ width: inputRef?.offsetWidth + 'px' }"
                  v-model="tagVisible"
                >
                  <q-tree
                    v-model:selected="info.tagKey"
                    :nodes="tagList"
                    node-key="key"
                    no-connectors
                    default-expand-all
                    no-transition
                    style="width: 100%"
                    @update:selected="
                      (target) => {
                        tagVisible = false;
                      }
                    "
                    v-if="tagList"
                  ></q-tree>
                </q-menu>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">
                资源名称<span class="text-red q-ml-sm text-h6">*</span>
              </div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.name"
                  required
                  placeholder="请输入资源名称"
                  :rules="[(val) => !!val || '资源名称必填']"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">
                资源面积
              </div>
              <div class="form-item-input dp-space-center">
                <q-input
                  dense
                  outlined
                  v-model="info.area"
                  placeholder="请输入资源面积"
                  :rules="[(val) => !!val || '资源面积必填']"
                  class="q-pb-none q-mr-md"
                  style="width: calc(100% - 130px)"
                />
                <q-select
                  v-model="info.areaUnit"
                  :options="['平方米', '亩']"
                  dense
                  class="no-border"
                  style="width: 120px"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">
                水体
              </div>
              <div class="form-item-input dp-space-center">
                <q-input
                    dense
                    outlined
                    v-model="info.waterArea"
                    required
                    placeholder="请输入水体面积"
                    class="full-width q-pb-none"
                >
                  <template v-slot:append>
                    <div class="text-body2">平方米</div>
                  </template></q-input
                >
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
              <div class="form-item-title">位置信息</div>
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
              <div
                class="form-item-input icon-point"
                @click="locationVisible = true"
              >
                <q-btn color="primary" label="地图选点" v-if="!info.location" />
                <template v-else>
                  经度:{{ info.location[0] }} , 纬度:{{
                    info.location[1]
                  }}</template
                >
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">资源图片</div>
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
              <div class="form-item-title">转换证明</div>
              <div class="form-item-file">
                <div class="upload-button">
                  <q-btn color="primary" label="上传资源"/>
                  <input
                      type="file"
                      @change="
                      //@ts-ignore
                      uploadImage($event.target.files[0], 'conversion')
                    "
                      class="upload-img"
                  />
                </div>
                <div
                    class="item-file"
                    v-for="(item, index) in info.conversionProof"
                    :key="`imageDetail${index}`"
                >
                  <div class="item-file-title">{{item}}</div>
                  <q-icon
                      name="cancel"
                      size="18px"
                      color="primary"
                      class="icon-point"
                      @click="info.conversionProof.splice(index, 1)"
                  />
                </div>

              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">是否闲置</div>
              <div class="form-item-input">
                <q-toggle v-model="info.unused" />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">是否上架</div>
              <div class="form-item-input">
                <q-toggle v-model="info.isStatus" />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">资产估值</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.valuation"
                  placeholder="请输入资产估值"
                  class="full-width q-pb-none"
                  type="number"
                  :min="0"
                >
                  <template v-slot:append>
                    <div class="text-body2">万元</div>
                  </template></q-input
                >
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">资源描述</div>
              <div class="form-item-box">
                <q-input
                  type="textarea"
                  dense
                  outlined
                  v-model="info.describe"
                  placeholder="请输入资源描述"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
          </div>
        </q-card>
      </q-expansion-item>
      <q-separator />
      <q-expansion-item label="权益信息" group="resource">
        <q-card>
          <div class="form-box resource-form-box">
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
              <div class="form-item-title">权属单位代码</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.ownerCode"
                  placeholder="请输入权属单位代码"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">权属证明文件</div>
              <div class="form-item-img">
                <div
                  class="item-img"
                  v-for="(item, index) in info.proof"
                  :key="`imageDetail${index}`"
                >
                  <q-icon
                    name="cancel"
                    size="18px"
                    class="item-img-close text-white icon-point"
                    @click="info.proof.splice(index, 1)"
                  />
                  <c-image :src="item" :list="info.proof" :isPreview="true" />
                </div>
                <div class="upload-button upload-img-button item-img-add">
                  <q-icon name="add" style="color: #ebebeb" size="45px" />
                  <input
                    type="file"
                    accept="image/*"
                    @change="
                      //@ts-ignore
                      uploadImage($event.target.files[0], 'message')
                    "
                    class="upload-img"
                  />
                </div>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">不动产证编号</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.propertyID"
                  placeholder="请输入不动产证编号"
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
              <div class="form-item-title">用途</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.purpose"
                  placeholder="请输入用途"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">权属状态</div>
              <div class="form-item-input">
                <q-select
                  outlined
                  v-model="info.propertyStatus"
                  :options="[
                    { value: 1, label: '临时' },
                    { value: 2, label: '现势' },
                    { value: 3, label: '历史' },
                    { value: 4, label: '终止' },
                  ]"
                  dense
                  class="full-width"
                  emit-value
                  map-options
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">权属性质</div>
              <div class="form-item-input">
                <q-select
                  outlined
                  v-model="info.propertyNature"
                  :options="[
                    { value: 1, label: '国有土地' },
                    { value: 2, label: '划拨' },
                    { value: 3, label: '作价出资（入股）' },
                    { value: 4, label: '租赁' },
                        { value: 5, label: '私人' },
                  ]"
                  dense
                  class="full-width"
                  emit-value
                  map-options
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">权利类型</div>
              <div class="form-item-input">
                <q-select
                  outlined
                  v-model="info.propertyType"
                  :options="[
                    { value: 1, label: '集体土地所有权' },
                    { value: 2, label: '国家土地所有权' },
                    { value: 3, label: '国有建设用地使用权' },
                    { value: 4, label: '房屋所有权' },
                    { value: 5, label: '宅基地使用权' },
                  ]"
                  dense
                  class="full-width"
                  emit-value
                  map-options
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
      <q-expansion-item label="招商项目属性" group="resource">
        <q-card>
          <div class="form-box resource-form-box">
            <div class="form-item">
              <div class="form-item-title">是否招商项目</div>
              <div class="form-item-input">
                <q-toggle v-model="info.investmentProject" />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">是否转化</div>
              <div class="form-item-input">
                <q-toggle v-model="info.hasConverted" />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">是否重点项目</div>
              <div class="form-item-input">
                <q-toggle v-model="info.keyProject" />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">招商目标</div>
              <div class="form-item-input">
                <q-checkbox
                  v-model="info.investmentObjective"
                  val="资金引入"
                  label="资金引入"
                />
                <q-checkbox
                  v-model="info.investmentObjective"
                  val="运营合作"
                  label="运营合作"
                />
                <q-checkbox
                  v-model="info.investmentObjective"
                  val="技术合作"
                  label="技术合作"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">资金引入金额</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.investmentAmount"
                  required
                  placeholder="请输入资金引入金额"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">运营合作租金</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.operatingRent"
                  required
                  placeholder="请输入运营合作租金"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">标的金额</div>
              <div class="form-item-input">
                <q-input
                  dense
                  outlined
                  v-model="info.targetAmount"
                  required
                  placeholder="请输入标的金额"
                  class="full-width q-pb-none"
                >
                  <template v-slot:append>
                    <div class="text-body2">万元</div>
                  </template></q-input
                >
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">计划开启时间</div>
              <div class="form-item-box form-item-select icon-point">
                {{ info.plannedStartDate }}
                <q-menu>
                  <q-date v-model="info.plannedStartDate" minimal
                /></q-menu>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">计划结束时间</div>
              <div class="form-item-box form-item-select icon-point">
                {{ info.plannedEndDate }}
                <q-menu>
                  <q-date v-model="info.plannedEndDate" minimal
                /></q-menu>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title">项目简介</div>
              <div class="form-item-box">
                <q-input
                  type="textarea"
                  dense
                  outlined
                  v-model="info.projectSummary"
                  placeholder="请输入项目简介"
                  class="full-width q-pb-none"
                />
              </div>
            </div>
          </div>
        </q-card>
      </q-expansion-item>
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
.resource-form {
  height: calc(100% - 50px);
}
.resource-form-box {
  height: calc(100vh - 280px);
  padding-bottom: 20px;
  box-sizing: border-box;
  @include scroll();
}
</style>
<style lang="scss"></style>
