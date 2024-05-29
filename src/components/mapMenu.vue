<script setup lang="ts">
import cMap from "@/components/common/cMap.vue";
const props = defineProps<{
  mapId: string;
  location: number[] | null;
  width: number;
  height: number;
}>();
const emits = defineEmits<{
  setLocation: [lo: number, la: number, center: number[], zoom: number];
  setLocationName: [address: string, location: any];
}>();
onMounted(() => {
  if (props.location) {
    mapLocation.value = {
      lng: props.location[0],
      lat: props.location[1],
      center: [114.78615, 26.45825],
      zoom: 10,
    };
  }
});
const inputName = ref<string>("");
const searchName = ref<string>("");
const locationName = ref<string>("");
const searchList = ref<any>([]);
const menuVisible = ref<boolean>(false);
const mapLocation = ref<{
  lng: number;
  lat: number;
  center: number[];
  zoom: number;
}>({
  lng: 114.78615,
  lat: 26.45825,
  center: [114.78615, 26.45825],
  zoom: 10,
});
const setLocation = (
  lo: number,
  la: number,
  center: number[],
  zoom: number,
  name: string
) => {
  mapLocation.value = { lng: lo, lat: la, center: center, zoom: zoom };
  locationName.value = name;
  emits("setLocation", lo, la, center, zoom);
};
const setList = (list) => {
  searchList.value = list;
};
</script>
<template>
  <div :style="{ width: width + 'px', height: height + 'px' }">
    <div
      class="dp-space-center"
      :style="{ width: width + 'px', height: '50px', marginBottom: '10px' }"
    >
      <q-input
        dense
        outlined
        v-model="inputName"
        placeholder="请输入位置名称"
        style="width: calc(100% - 100px)"
        class="q-pb-none q-mr-sm"
        @change.native="searchName = inputName"
      />

      <q-btn
        color="primary"
        dense
        style="width: 80px"
        @click="
          mapLocation = {
            lng: 114.78615,
            lat: 26.45825,
            center: [114.78615, 26.45825],
            zoom: 10,
          };
          inputName = '';
        "
        label="重置"
      />
      <q-menu class="q-pa-sm" v-if="inputName">
        <q-list dense>
          <!--  @click="editFile(item._key, index)" -->
          <q-item
            v-for="(item, index) in searchList"
            clickable
            v-close-popup
            @click="
              inputName = item.name;
              mapLocation = {
                lng: item.location.lng,
                lat: item.location.lat,
                center: [114.78615, 26.45825],
                zoom: 10,
              };
            "
            :key="`location${item.id}`"
          >
            <q-item-section>{{ item.name }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>
    <div class="q-mb-sm">当前地址: {{ locationName }}</div>
    <div :style="{ width: width + 'px', height: height - 70 + 'px' }">
      <c-map
        :mapId="mapId"
        :location="mapLocation"
        @setLocation="setLocation"
        @setList="setList"
        :keyword="searchName"
      />
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
<style lang="scss"></style>
