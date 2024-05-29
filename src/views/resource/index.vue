<script setup lang="ts">
import {Region, ResultProps} from "@/interface/Common";
import api from "@/services/api";
import {commonDelete} from "@/services/util/common";
import { setMessage,setLoading } from "@/services/util/common";
import cDrawer from "@/components/common/cDrawer.vue";
import cHeader from "@/components/common/cHeader.vue";
import SelectRegion from "@/components/selectRegion.vue";
import {formatData} from "@/services/util/data";
import Detail from "./detail.vue";
import {storeToRefs} from "pinia";
import appStore from "@/store";
import axios from "axios";
// investmentProject(是否招商项目), keyProject(是否重点项目), investmentObjective(招商目标), investmentAmount(资金引入金额), operatingRent(运营合作租金), targetAmount(标的金额),
// plannedStartDate(计划开始时间), plannedEndDate(计划结束时间), projectSummary(项目简介)

export interface DataInterface {
  _key?: string;
  name: string;
  tagKey: string;
  area: number;
  waterArea:number;
  areaUnit: string;
  regionCode: string;
  regionArr: any;
  address: string;
  location: number[] | null;
  imageList: string[];
  conversionProof: string[];
  unused: boolean;
  valuation: number;
  describe: string;
  status: boolean | number;
  owner: string;
  ownerCode: string;
  proof: string[];
  propertyID: string;
  contact: string;
  purpose: string;
  isStatus: boolean;
  propertyStatus: number;
  propertyNature: number;
  propertyType: number;
  contactAddress: string;
  detailAddress: string;
  investmentProject: boolean;
  keyProject: boolean;
  investmentObjective: string[];
  investmentAmount: string;
  operatingRent: string;
  targetAmount: string;
  plannedStartDate: number | null;
  plannedEndDate: number | null;
  projectSummary: string;
  hasConverted: boolean;
}
const {token} = storeToRefs(appStore.authStore);
const {spaceInfo} = storeToRefs(appStore.spaceStore);
const dayjs: any = inject("dayjs");
const dataList = ref<DataInterface[]>([]);
const dataInfo = ref<DataInterface | null>(null);
const inputName = ref<string>("");
const searchName = ref<string>("");
const inputRegionName = ref<string>("");
const regionName = ref<string>("");
const searchType = ref<string>("全部");
const searchTime = ref<{ from: string; to: string } | string | null>(null);
const status = ref<number | null>(null);
const detailVisible = ref<boolean>(false);
const page = ref<number>(1);
const total = ref<number>(0);
const inputRef = ref<HTMLElement | null>(null);
const regionCode = ref<string>("");
const rootKey = ref<string>("");
const tagVisible = ref<boolean>(false);
const tagTree = ref<any>({});
const tagKey = ref<string>("");
const tagList = computed(() => {
  if (rootKey.value && tagTree.value) {
    tagTree.value[rootKey.value].selectable = false;
    return [formatData(tagTree.value, rootKey.value)];
  }
});
const columns: any = [
  {
    name: "name",
    label: "名称",
    align: "center",
    field: "name",
  },
  // {
  //   name: "plannedEndDate",
  //   label: "截止时间",
  //   align: "center",
  //   field: "plannedEndDate",
  // },
  {
    name: "regionCode",
    label: "所在行政区",
    align: "center",
    field: "regionCode",
  },
  {
    name: "area",
    label: "面积",
    align: "center",
    field: "area",
  },
  {
    name: "waterArea",
    label: "水体",
    align: "center",
    field: "area",
  },
  {
    name: "valuation",
    label: "估值",
    align: "center",
    field: "valuation",
  },

  {
    name: "targetAmount",
    label: "标的金额",
    align: "center",
    field: "targetAmount",
  },
  {
    name: "isStatus",
    label: "是否上架",
    align: "center",
    field: "isStatus",
  },
  {
    name: "investmentProject",
    label: "是否招商项目",
    align: "center",
    field: "investmentProject",
  },
  {
    name: "hasConverted",
    label: "是否转化",
    align: "center",
    field: "hasConverted",
  },

  {
    name: "keyProject",
    label: "是否重点项目",
    align: "center",
    field: "keyProject",
  },
  // {
  //   name: "name",
  //   label: "已完成交易",
  //   align: "center",
  //   field: "name",
  // },
  {
    name: "operate",
    align: "center",
    label: "操作",
    field: "operate",
  },
];

const getTag = async () => {
  const tagRes = (await api.request.get("resourceTag/tree")) as ResultProps;
  if (tagRes.msg === "OK") {
    tagTree.value = tagRes.data;
    //@ts-ignore
    rootKey.value = tagRes.rooter._key;
  }
};

const getData = async () => {
  let dataRes = (await api.request.get("ecoResource/back", {
    resourceName: searchName.value,
    begTime:
        typeof searchTime.value === "string"
            ? dayjs(searchTime.value).startOf("day").valueOf()
            : searchTime.value?.from
                ? dayjs(searchTime.value.from).startOf("day").valueOf()
                : null,
    endTime:
        typeof searchTime.value === "string"
            ? dayjs(searchTime.value).endOf("day").valueOf()
            : searchTime.value?.to
                ? dayjs(searchTime.value!.to).endOf("day").valueOf()
                : null,
    status: status.value,
    tagKey: tagKey.value,
    regionCode: regionCode.value,
    page: page.value,
    limit: 30,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    dataRes.data = dataRes.data.map((item) => {
      item.isStatus = !!item.status;
      item.hasConverted = !!item.hasConverted;
      return item;
    });
    console.log(dataRes.data);
    dataList.value = [...dataRes.data];
    total.value = dataRes.total!;
  }
};
const deleteData = (key) => {
  commonDelete("ecoResource/back", "resourceKey", key, () => {
    dataList.value = dataList.value.filter((item) => item._key !== key);
  });
};
const chooseFile = async (e, file) => {
  const formData = new FormData();
  formData.append("file", file);
  console.log(file)
  const createRes = (await axios.post(
      "https://nodeserver.qingtime.cn/upload",
      formData,
      {
        // 因为我们上传了图片,因此需要单独执行请求头的Content-Type
        headers: {
          // 表示上传的是文件,而不是普通的表单数据
          "Content-Type": "multipart/form-data",
          token: token.value,
        },
      },
  )) as ResultProps;
  if (createRes.data.msg === "OK") {
    setMessage("success", "上传文件成功,导入中...");
    e.target.value = "";
    importFile(createRes.data.filePath);
  }
};
const downloadFile = () => {
  let a = document.createElement("a"); //创建一个<a></a>标签
  a.href = "https://nodeserver.qingtime.cn/两山生态资源批量导入模板.xlsx"; // 给a标签的href属性值加上地址，注意，这里是绝对路径，不用加 点.
  a.download = "资源批量导入模板.xlsx"; //设置下载文件文件名，这里加上.xlsx指定文件类型，pdf文件就指定.fpd即可
  a.style.display = "none"; // 障眼法藏起来a标签
  document.body.appendChild(a); // 将a标签追加到文档对象中
  a.click(); // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
  a.remove(); // 一次性的，用完就删除a标签
};

const importFile = async (filePath) => {
  setLoading(true);
  const importRes = (await api.request.post("ecoResource/import", {
    // teamKey: spaceKey.value,
    regionCode:spaceInfo.value.regionCode,
    filePath: filePath,
  })) as ResultProps;
  if (importRes.msg === "OK") {
    setMessage("success", "导入成功");
    getData();
  }
  setLoading(false);
};

const updateData = (info) => {
  console.log(info);
  let index = dataList.value.findIndex((item) => item._key === info._key);
  if (index !== -1) {
    info.isStatus = !!info.status;
    dataList.value[index] = {...dataList.value[index], ...info};
  } else {
    getData();
  }
};
watchEffect(() => {
  if (spaceInfo.value && regionCode.value) {
    getData();
  }
});
watch(
    spaceInfo,
    (newInfo) => {
      if (newInfo) {
        getTag();
        if (!regionCode.value) {
          regionCode.value = spaceInfo.value.regionCode;
        }
      }
    },
    {immediate: true}
);
watch(inputName, (newName) => {
  if (!newName) {
    searchName.value = "";
  }
});
watch(inputRegionName, (newName) => {
  if (!newName) {
    regionName.value = "";
  }
});
</script>
<template>
  <div class="farm common-table">
    <cHeader title="生态资源"/>
    <div class="common-table-container">
      <div class="common-table-header">
        <div class="dp--center">
          <q-input
              outlined
              v-model="inputName"
              placeholder="请输入资源名称"
              dense
              style="width: 150px"
              clearable
              class="q-mr-sm"
              @change.native="searchName = inputName"
          />
          <!--搜索-->
          <q-select
              outlined
              dense
              v-model="status"
              placeholder="请输入类型"
              class="q-mr-sm"
              style="width: 150px"
              :options="[
              { value: null, label: '全部' },
              { value: 1, label: '已上架' },
              { value: 0, label: '未上架' },
            ]"
              emit-value
              map-options
          />
          <div class="form-item-select icon-point" :style="{ width: '150px' }">
            <span v-if="tagTree[tagKey]?.name">{{ tagTree[tagKey].name }}</span>
            <span v-else class="text-grey-7">请选择资源类型</span>

            <q-icon
                name="arrow_drop_down"
                color="grey-7"
                style="margin-left: 8px"
                size="25px"
                class="select-icon"
            />
            <q-menu :style="{ width: '150px' }" v-model="tagVisible">
              <q-tree
                  v-model:selected="tagKey"
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
          <q-icon
              name="cancel"
              size="24px"
              @click="tagKey = ''"
              color="grey-6  q-ml-sm"
              v-if="tagKey"
          />
          <div class="time-content">
            <template v-if="typeof searchTime === 'string'">
              <div class="time-span">
                {{ searchTime }}
              </div>
            </template>
            <template v-else>
              <div class="time-span">
                <span v-if="searchTime?.from">{{ searchTime.from }}</span>
                <span v-else class="text-grey-7">请选择起始时间</span>
              </div>
              ---
              <div class="time-span">
                <span v-if="searchTime?.to">{{ searchTime.to }}</span>
                <span v-else class="text-grey-7">请选择截止时间</span>
              </div>
            </template>

            <q-icon
                name="cancel"
                size="24px"
                @click="searchTime = null"
                color="grey-6 q-ml-sm"
                v-if="searchTime"
            />

            <q-menu>
              <q-date v-model="searchTime" minimal range/>
            </q-menu>
          </div>
        </div>

        <!--搜索-->
        <q-space/>
        <div class="dp--center">
            <q-btn
                rounded
                color="primary"
                label="新增资源"
                @click="
            detailVisible = true;
            dataInfo = null;
          "
                style="width: 120px"
            />
          </div>

        </div>
        <div class="dp-space-center">
          <div class="dp--center">
          <SelectRegion
              :regionCode="regionCode"
              clearState
              @setCode="
            (obj, code) => {
              regionCode = code;
            }
          "
              @clearCode="regionCode = spaceInfo.regionCode"
          />
          </div>
          <div  class="dp--center justify-end">
            <q-btn
                flat
                style="color: #1976d2"
                label="下载模板"
                @click="downloadFile()"
            />
            <div
                class="upload-button upload-img-button"
                style="border: 0px"
            >
              <q-btn
                  rounded
                  color="primary"
                  label="导入资源"
                  @click=""
                  style="width: 120px"
              />
              <input
                  type="file"
                  @change="
                //@ts-ignore
                chooseFile($event, $event.target.files[0])
              "
                  class="upload-img"
              />
            </div>
          </div>
        </div>
        <div class="common-table-content">
          <q-table
              :rows="dataList"
              :columns="columns"
              row-key="_key"
              style="
            width: 100%;
            height: calc(100% - 80px);
            margin-bottom: 20px;
            padding: 5px;
          "
              hide-pagination
              :rows-per-page-options="[30]"
          >
            <!-- name(名称), tagKey(类型标签), area(面积), areaUnit(面积单位), regionCode(区域编码), describe(资源描述), location(位置),address(详细地址),
  imageList(资源图片), valuation(估值), unused(是否闲置),owner(权益人),ownerCode(权益人编号), proof(证明文件图片列表), propertyID(不动产编号), contact(联系人),
  purpose(用途), propertyStatus(权属状态), propertyNature(权属性质), propertyType(权属类型), contactAddress(联系人地址), detailAddress(详细地址),
  investmentProject(是否招商项目), keyProject(是否重点项目), investmentObjective(招商目标), investmentAmount(资金引入金额), operatingRent(运营合作租金), targetAmount(标的金额),
  plannedStartDate(计划开始时间), plannedEndDate(计划结束时间), projectSummary(项目简介) -->
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>
                <!-- <q-td key="plannedEndDate" :props="props">
                  {{
                    props.row.plannedEndDate
                      ? dayjs(props.row.plannedEndDate).format("YYYY-MM-DD")
                      : ""
                  }}
                </q-td> -->
                <q-td key="regionCode" :props="props">
                  {{
                    props.row.regionArr
                        ? `${
                            props.row.regionArr.cityCode
                                ? props.row.regionArr.cityCode.name
                                : ""
                        } ${
                            props.row.regionArr.districtCode
                                ? props.row.regionArr.districtCode.name
                                : ""
                        } ${
                            props.row.regionArr.townCode
                                ? props.row.regionArr.townCode.name
                                : ""
                        } ${
                            props.row.regionArr.villageCode
                                ? props.row.regionArr.villageCode.name
                                : ""
                        }`
                        : ""
                  }}
                </q-td>
                <q-td key="area" :props="props" style="width: 150px">
                  {{ props.row.area }} {{ props.row.areaUnit }}
                </q-td>
                <q-td key="waterArea" :props="props" style="width: 150px">
                  {{ props.row.waterArea }} 平方米
                </q-td>
                <q-td key="valuation" :props="props" style="width: 150px">
                  {{ props.row.valuation ? props.row.valuation + " 万元" : "" }}
                </q-td>
                <q-td key="targetAmount" :props="props" style="width: 150px">
                  {{
                    props.row.targetAmount ? props.row.targetAmount + " 万元" : ""
                  }}
                </q-td>
                <q-td key="isStatus" :props="props" style="width: 150px">
                  <q-toggle v-model="props.row.isStatus" disable/>
                </q-td>

                <q-td key="investmentProject" :props="props" style="width: 150px">
                  <q-toggle v-model="props.row.investmentProject" disable/>
                </q-td>
                <q-td key="hasConverted" :props="props" style="width: 150px">
                  <q-toggle v-model="props.row.hasConverted" disable/>
                </q-td>
                <q-td key="keyProject" :props="props" style="width: 150px">
                  <q-toggle v-model="props.row.keyProject" disable/>
                </q-td>
                <q-td key="operate" :props="props" style="width: 150px">
                  <q-btn
                      flat
                      label="详情"
                      color="primary"
                      @click="
                    detailVisible = true;
                    dataInfo = props.row;
                  "
                  />
                  <q-btn
                      flat
                      label="删除"
                      color="grey-5"
                      @click="deleteData(props.row._key)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <div class="row justify-end items-center">
            <q-pagination
                v-model="page"
                :max="total / 30"
                direction-links
                flat
                color="grey"
                active-color="primary"
            />
          </div>
        </div>
      </div>
      <c-drawer
          :visible="detailVisible"
          @close="
        detailVisible = false;
        dataInfo = null;
      "
          title="详情"
          :drawerStyle="{
        width: '600px',
      }"
          opacityMask
      >
        <template #content>
          <Detail
              :info="dataInfo"
              :tagList="tagList"
              :tagTree="tagTree"
              @updateData="updateData"
              @close="
            detailVisible = false;
            dataInfo = null;
          "
          />
        </template>
      </c-drawer>
    </div>
</template>
<style scoped lang="scss">
.time-content {
  width: 400px;
  height: 100%;
  flex-shrink: 0;
  cursor: pointer;
  @include flex(flex-start, center, null);

  .time-span {
    width: 150px;
    height: 40px;
    border: 1px solid #bebebf;
    border-radius: 5px;
    margin: 0px 10px;
    text-align: center;
    line-height: 40px;
    flex-shrink: 0;
  }
}
</style>
<style lang="scss"></style>
