<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import { commonDelete } from "@/services/util/common";
import cDrawer from "@/components/common/cDrawer.vue";
import cHeader from "@/components/common/cHeader.vue";
import SelectRegion from "@/components/selectRegion.vue";
import { formatData } from "@/services/util/data";
import Detail from "./detail.vue";
import { storeToRefs } from "pinia";
import appStore from "@/store";

export interface DataInterface {
  _key?: string;
  name: string;
  type: string;
  regionCode: string;
  regionArr: any;
  address: string;
  location: number[] | null;
  imageList: string[];
  production: number;
  productionUnit: string;
  describe: string;
  status: number;
  isStatus: boolean;
  keyProduct: boolean;
  area: number;
  areaUnit: string;
  orderAmount: number;
  orderUnit: string;
  transactionAmount: number;
  transactionUnit: string;
  owner: string;
  contact: string;
  contactAddress: string;
  detailAddress: string;
}
const { spaceInfo } = storeToRefs(appStore.spaceStore);
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
const regionCode = ref<string>("");
const type = ref<string | null>(null);

const columns: any = [
  {
    name: "name",
    label: "名称",
    align: "center",
    field: "name",
  },
  {
    name: "production",
    label: "年产量",
    align: "center",
    field: "production",
  },
  {
    name: "area",
    label: "种植面积",
    align: "center",
    field: "area",
  },
  {
    name: "orderAmount",
    label: "订单额",
    align: "center",
    field: "orderAmount",
  },
  {
    name: "transactionAmount",
    label: "交易额",
    align: "center",
    field: "transactionAmount",
  },
  {
    name: "regionCode",
    label: "所在行政区",
    align: "center",
    field: "regionCode",
  },
  {
    name: "owner",
    label: "权益人",
    align: "center",
    field: "owner",
  },
  {
    name: "contact",
    label: "联系方式",
    align: "center",
    field: "contact",
  },
  {
    name: "contactAddress",
    label: "地址",
    align: "center",
    field: "contactAddress",
  },
  {
    name: "isStatus",
    label: "是否上架",
    align: "center",
    field: "isStatus",
  },
  {
    name: "keyProduct",
    label: "是否重点产品",
    align: "center",
    field: "keyProduct",
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

const getData = async () => {
  let dataRes = (await api.request.get("product/back", {
    name: searchName.value,
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
    type: type.value,
    regionCode: regionCode.value,
    page: page.value,
    limit: 30,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    dataRes.data = dataRes.data.map((item) => {
      item.isStatus = !!item.status;
      return item;
    });
    console.log(dataRes.data);
    dataList.value = [...dataRes.data];
    total.value = dataRes.total!;
  }
};
const deleteData = (key) => {
  commonDelete("product", "productKey", key, () => {
    dataList.value = dataList.value.filter((item) => item._key !== key);
  });
};
const updateData = (info) => {
  console.log(info);
  let index = dataList.value.findIndex((item) => item._key === info._key);
  if (index !== -1) {
    info.isStatus = !!info.status;
    dataList.value[index] = { ...dataList.value[index], ...info };
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
      if (!regionCode.value) {
        regionCode.value = spaceInfo.value.regionCode;
      }
    }
  },
  { immediate: true }
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
    <cHeader title="生态产品" />
    <div class="common-table-container">
      <div class="common-table-header">
        <div class="dp--center">
          <q-input
            outlined
            v-model="inputName"
            placeholder="请输入产品名称"
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
          <q-select
            outlined
            dense
            v-model="type"
            placeholder="请输入类型"
            class="q-mr-sm"
            style="width: 150px"
            :options="[
              { value: null, label: '全部' },
              { value: '农', label: '农' },
              { value: '林', label: '林' },
              { value: '牧', label: '牧' },
              { value: '渔', label: '渔' },
            ]"
            emit-value
            map-options
          />
          <!-- <div class="time-content">
            <template v-if="typeof searchTime === 'string'">
              <div class="time-span">
                {{ searchTime }}
              </div>
            </template>
            <template v-else>
              <div class="time-span">
                {{ searchTime?.from ? searchTime.from : "起始时间" }}
              </div>
              ---
              <div class="time-span">
                {{ searchTime?.to ? searchTime.to : "结束时间" }}
              </div>
            </template>

            <q-icon
              name="cancel"
              size="24px"
              @click="searchTime = null"
              color="grey-6"
              v-if="searchTime"
            />

            <q-menu>
              <q-date v-model="searchTime" minimal range />
            </q-menu>
          </div> -->
        </div>

        <!--搜索-->
        <q-space />
        <q-btn
          rounded
          color="primary"
          label="新增产品"
          @click="
            detailVisible = true;
            dataInfo = null;
          "
          style="width: 120px"
        />
      </div>
      <div class="dp--center">
        <SelectRegion
          :regionCode="regionCode"
          @setCode="
            (obj, code) => {
              regionCode = code;
            }
          "
          @clearCode="regionCode = spaceInfo.regionCode"
        />
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
          <!-- type(分类), name(名称), location(经纬度), address(位置信息), regionCode(行政编码), area(种植面积),
areaUnit(面积单位), imageList(图片列表), keyProduct(是否重点产品), status(是否上架), production(年产量), productionUnit(产量单位),
orderAmount(订单额), orderUnit(订单额单位), transactionAmount(交易额), transactionUnit(交易额单位), describe(产品描述),
owner(权益人/权属单位), contact(联系方式), contactAddress(联系地址), detailAddress(详细地址) -->
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props" style="width: 200px">
                {{ props.row.name }}
              </q-td>
              <q-td key="production" :props="props" style="width: 80px">
                {{ props.row.production }} {{ props.row.productionUnit }}
              </q-td>
              <q-td key="area" :props="props" style="width: 80px">
                {{ props.row.area }} {{ props.row.areaUnit }}
              </q-td>
              <q-td key="orderAmount" :props="props" style="width: 120px">
                {{ props.row.orderAmount }} {{ props.row.orderUnit }}
              </q-td>
              <q-td key="transactionAmount" :props="props" style="width: 120px">
                {{ props.row.transactionAmount }}
                {{ props.row.transactionUnit }}
              </q-td>
              <q-td key="regionCode" :props="props" style="width: 120px">
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

              <q-td key="owner" :props="props" style="width: 150px">
                {{ props.row.owner }}
              </q-td>
              <q-td key="contact" :props="props" style="width: 150px">
                {{ props.row.contact }}
              </q-td>
              <q-td key="contactAddress" :props="props" style="width: 150px">
                {{ props.row.contactAddress }}
              </q-td>

              <q-td key="isStatus" :props="props">
                <q-toggle v-model="props.row.isStatus" disable />
              </q-td>
              <q-td key="keyProduct" :props="props">
                <q-toggle v-model="props.row.keyProduct" disable />
              </q-td>
              <q-td key="operate" :props="props" style="width: 100px">
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
          @updateData="updateData"
          @close="
            detailVisible = false;
            dataInfo = null;
          "
      /></template>
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
