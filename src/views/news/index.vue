<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import { commonDelete } from "@/services/util/common";
import cDrawer from "@/components/common/cDrawer.vue";
import cHeader from "@/components/common/cHeader.vue";
import cImage from "@/components/common/cImage.vue";
import Detail from "./detail.vue";
import { storeToRefs } from "pinia";
import appStore from "@/store";

export interface DataInterface {
  _key?: string;
  industry: string;
  type: string;
  content: any;
  title: string;
  summary: string;
  cover: string;
}
const { spaceInfo } = storeToRefs(appStore.spaceStore);
const dayjs: any = inject("dayjs");
const dataList = ref<DataInterface[]>([]);
const dataInfo = ref<DataInterface | null>(null);
const inputName = ref<string>("");
const searchName = ref<string>("");
const type = ref<string | null>(null);
const industry = ref<string | null>(null);
const searchTime = ref<{ from: string; to: string } |string| null>(null);

const detailVisible = ref<boolean>(false);
const page = ref<number>(1);
const total = ref<number>(0);
const columns: any = [
  {
    name: "cover",
    align: "center",
    label: "封面",
    field: "cover",
  },

  {
    name: "industry",
    label: "行业分类",
    align: "center",
    field: "industry",
  },
  {
    name: "type",
    label: "类型",
    align: "center",
    field: "type",
  },
  {
    name: "title",
    label: "新闻标题",
    align: "center",
    field: "title",
  },
  {
    name: "summary",
    align: "center",
    label: "摘要",
    field: "summary",
  },
  {
    name: "createTime",
    align: "center",
    label: "发布时间",
    field: "createTime",
  },
  {
    name: "operate",
    align: "center",
    label: "操作",
    field: "operate",
  },
];
const getData = async () => {
  let dataRes = (await api.request.get("news/back", {
    title: searchName.value,
    type: type.value,
    industry: industry.value,
    clientKey: spaceInfo.value._key,

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
    page: page.value,
    limit: 30,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    dataList.value = [...dataRes.data];
    total.value = dataRes.total!;
  }
};
const deleteData = (key) => {
  commonDelete("news", "newsKey", key, () => {
    dataList.value = dataList.value.filter((item) => item._key !== key);
  });
};
const updateData = (info) => {
  console.log(info);
  let index = dataList.value.findIndex((item) => item._key === info._key);
  if (index !== -1) {
    dataList.value[index] = { ...dataList.value[index], ...info };
  } else {
    getData();
  }
};
watchEffect(() => {
  if (spaceInfo.value) {
    getData();
  }
});
watch(inputName, (newName) => {
  if (!newName) {
    searchName.value = "";
  }
});
</script>
<template>
  <div class="goods common-table">
    <cHeader title="文章管理" />
    <div class="common-table-container">
      <div class="common-table-header">
        <q-input
          outlined
          v-model="inputName"
          placeholder="请输入新闻标题"
          dense
          style="width: 160px"
          clearable
          class="q-mr-sm"
          @change.native="searchName = inputName"
        />
        <!--搜索-->
        <q-select
          outlined
          dense
          v-model="industry"
          placeholder="请输入行业类型"
          class="q-mr-sm"
          style="width: 150px"
          :options="[
            { value: null, label: '全部' },
            { value: '农', label: '农' },
            { value: '林', label: '林' },
            { value: '牧', label: '牧' },
            { value: '渔', label: '渔' },
             { value: '文旅', label: '文旅' },
          ]"
          emit-value
          map-options
        />
        <q-select
          outlined
          dense
          v-model="type"
          placeholder="请输入分类"
          :options="[
            { value: null, label: '全部' },
            { value: '新闻', label: '新闻' },
            { value: '政策', label: '政策' },
          ]"
          class="q-mr-sm"
          style="width: 150px"
          emit-value
          map-options
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
            <q-date v-model="searchTime" minimal range />
          </q-menu>
        </div>

        <q-space />
        <q-btn
          rounded
          color="primary"
          label="新建文章"
          @click="
            detailVisible = true;
            dataInfo = null;
          "
          style="width: 120px"
        />
      </div>
      <div class="common-table-content" style="height: calc(100% - 80px)">
        <q-table
          :rows="dataList"
          :columns="columns"
          row-key="_key"
          style="
            width: 100%;
            height: calc(100% - 40px);
            margin-bottom: 20px;
            padding: 5px;
          "
          hide-pagination
          :rows-per-page-options="[30]"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="cover" :props="props">
                <!-- {{ props.row.imageList }} -->

                <c-image
                  :src="props.row.cover"
                  :isPreview="true"
                  v-if="props.row.cover"
                />
              </q-td>
              <q-td key="industry" :props="props">
                {{ props.row.industry }}
              </q-td>
              <q-td key="type" :props="props">
                {{ props.row.type }}
              </q-td>
              <q-td key="title" :props="props">
                <div
                  style="width: 300px; white-space: normal; text-align: left"
                >
                  {{ props.row.title }}
                </div>
              </q-td>

              <q-td key="summary" :props="props">
                <div
                  style="width: 300px; white-space: normal; text-align: left"
                >
                  {{ props.row.summary }}
                </div>
              </q-td>

              <q-td key="createTime" :props="props">
                {{ dayjs(props.row.createTime).format("YYYY/MM/DD") }}
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
  cursor: pointer;
  @include flex(flex-start, center, null);
  .time-span {
    width: 120px;
    height: 40px;
    border: 1px solid #bebebf;
    border-radius: 5px;
    margin: 0px 10px;
    text-align: center;
    line-height: 40px;
    flex-shrink: 0;
  }
}
.news-img {
  width: 100%;
  min-height: 70px;
  @include flex(flex-start, center, wrap);
  .news-img-item {
    width: 70px;
    height: 70px;
    margin-right: 10px;
    margin-bottom: 15px;
    border-radius: 6px;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 6px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &:nth-child(4n) {
      margin-right: 0px;
    }
  }
}
</style>
<style lang="scss"></style>
