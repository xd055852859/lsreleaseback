<script setup lang="ts">
import api from "@/services/api";
import AMapLoader from "@amap/amap-jsapi-loader";
import axios from "axios";

const props = defineProps<{
  mapId: string;
  keyword?: string;
  location?: any;
  type?: string;
}>();
const emits = defineEmits<{
  setLocation: [
    lo: number,
    la: number,
    center: number[],
    zoom: number,
    name: string
  ];
  setList: [list: any];
  // setLocationName: [address: string, location: any];
}>();
const amap = shallowRef<any>(null);
const amapData = shallowRef<any>(null);
const marker = shallowRef<any>(null);
const disProvince = shallowRef<any>(null);
const colors = ref<any>({});
// var geoJsonData = `{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[116.403322, 39.920255],[116.410703, 39.897555],[116.402292, 39.892353],[116.389846, 39.891365]]]},"properties":{"name":"多边形"}}]}`;
onMounted(() => {
  initMap();
});
onUnmounted(() => {
  if (amap.value) {
    amap.value.off("click", clickMap);
    if (marker.value) {
      amap.value.remove(marker.value);
      marker.value = null;
    }
    amapData.value = null;
    amap.value.destroy();
    amap.value = null;
  }
});

const initMap = () => {
  AMapLoader.load({
    key: "70beeffb8fc9537f6d450fd3747b70c9", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      "AMap.Geocoder",
      "AMap.DistrictSearch",
      "AMap.MarkerClusterer",
      "AMap.DistrictLayer",
      "AMap.GeoJSON",
    ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      const district = new AMap.DistrictSearch({
        extensions: "all",
        level: "province",
        subdistrict: 1,
      });
      district.search("万安县", (status, result) => {
        // 查询成功时，result即为对应的行政区信息

        const bounds = result.districtList[0].boundaries;
        const mask: any = [];
        for (let i = 0; i < bounds.length; i++) {
          mask.push([bounds[i]]);
        }
        console.log(mask); // 这里是整个郑州市的边界经纬度
        amap.value = new AMap.Map(props.mapId, {
          // 设置地图容器id
          mask: mask, // 为Map实例制定掩模的路径,各图层将值显示路径范围内图像,3D模式下有效
          zoom: 10, // 设置当前显示级别
          expandZoomRange: true, // 开启显示范围设置
          zooms: [10, 14], //最小显示级别为7，最大显示级别为20
          center: [114.78615, 26.45825], // 设置地图中心点位置
          viewMode: "3D", // 特别注意,设置为3D则其他地区不显示
          zoomEnable: true, // 是否可以缩放地图
          resizeEnable: true,
          mapStyle: "amap://styles/61aa41120d9281ca215a0244f9186e18",
        });
        amapData.value = AMap;
        // 添加描边
        for (let i = 0; i < bounds.length; i++) {
          const polyline = new AMap.Polyline({
            path: bounds[i], // polyline 路径，支持 lineString 和 MultiLineString
            strokeColor: "#3078AC", // 线条颜色，使用16进制颜色代码赋值。默认值为#00D3FC
            strokeWeight: 1, // 轮廓线宽度,默认为:2
            // map:map // 这种方式相当于: polyline.setMap(map);
            fillOpacity: 0.15, //透明度
            fillColor: "#256edc", //填充颜色
          });
          polyline.setMap(amap.value);
        }
        // axios.get("https://cdn.qingtime.cn/map.json").then((res) => {
        //   const geoJson = new AMap.GeoJSON({
        //     //将字符串形式的 GeoJSON 数据解析为对象
        //     geoJSON: res.data,
        //     //定义一个回调函数来创建多边形对象，该函数接收一个 geojson 对象和一个 lnglats 数组作为参数
        //     getPolygon: function (geojson, lnglats) {
        //       // console.log(lnglats);
        //       // // 返回一个新的 AMap.Polygon 对象，传入路径、填充透明度、边框颜色和填充颜色等选项
        //       // //还可以自定义 getMarker 和 getPolyline，用于创建标记和折线对象
        //       return new AMap.Polygon({
        //         path: lnglats,
        //         fillOpacity: 0.5,
        //         strokeColor: "white",
        //         fillColor: "blue",
        //       });
        //       // var area = amapData.value.GeometryUtil.ringArea(lnglats[0]);
        //     },
        //   });
        //   console.log(geoJson);
        //   //将geoJson对象添加到地图上
        //   // geoJson.setMap(amap.value);
        //   amap.value.add(geoJson);
        // });
        console.log(props.location);
        if (props.location) {
          setPointer(props.location?.lng, props.location?.lat);
        }
        amap.value.on("click", clickMap);
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

const setPointer = (lng, lat) => {
  if (marker.value) {
    amap.value.remove(marker.value);
  }
  marker.value = new amapData.value.Marker({
    position: new amapData.value.LngLat(lng, lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
    label: "当前",
  });
  amap.value.add(marker.value);
  console.log(lng, lat);
  amap.value.plugin("AMap.Geocoder", function () {
    var geocoder = new amapData.value.Geocoder({
      // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
      city: "全国",
    });
    geocoder.getAddress([lng, lat], function (status, result) {
      if (status === "complete" && result.info === "OK") {
        // result为对应的地理位置详细信息
        console.log(result);
        emits(
          "setLocation",
          lng,
          lat,
          amap.value.getCenter(),
          amap.value.getZoom(),
          lng === 114.78615 && lat === 26.45825
            ? ""
            : result.regeocode.formattedAddress
        );
        // marker.value.set(result.regeocode.formattedAddress);
      }
    });
  });
};

const clickMap = (e) => {
  console.log(e);
  if (e.lnglat.lng && e.lnglat.lat) {
    setPointer(e.lnglat.lng, e.lnglat.lat);
  }
};
watch(
  () => props.keyword,
  (newWord) => {
    console.log(newWord);
    if (newWord) {
      amapData.value.plugin("AMap.Autocomplete", function () {
        // 实例化Autocomplete
        var autoOptions = {
          //city 限定城市，默认全国
          city: "全国",
        };
        var autoComplete = new amapData.value.Autocomplete(autoOptions);
        console.log(newWord, autoComplete);
        autoComplete.search(newWord, function (status, result) {
          // 搜索成功时，result即是对应的匹配数据
          if (status === "complete" && result.info === "OK") {
            emits("setList", result.tips);
          }
        });
      });
    }
  }
);
watch(
  () => props.location,
  (newLocation, oldLocation) => {
    if (
      newLocation &&
      (newLocation.lng !== oldLocation.lng ||
        newLocation.lat !== oldLocation.lat)
    ) {
      setPointer(newLocation.lng, newLocation.lat);
    }
  }
);
</script>
<template>
  <div :id="props.mapId" class="common-map"></div>
</template>
<style scoped lang="scss"></style>
<style lang="scss">
.common-map {
  width: 100%;
  height: 100%;
}
</style>
