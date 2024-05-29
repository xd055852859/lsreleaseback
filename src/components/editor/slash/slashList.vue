<script setup lang="ts">
import { setLoading } from "@/services/util/common";
import { uploadFile } from "@/services/util/file";
import { getBase64 } from "@/services/util/util";
import pIcon from "@/components/common/pIcon.vue";
const props = defineProps<{
  items: any;
  command: Function;
}>();
const route = useRoute();
const selectedIndex = ref<number>(0);
const onKeyDown = ({ event }) => {
  if (event.key === "ArrowUp") {
    upHandler();
    return true;
  }

  if (event.key === "ArrowDown") {
    downHandler();
    return true;
  }

  if (event.key === "Enter") {
    enterHandler();
    return true;
  }

  return false;
};

const upHandler = () => {
  selectedIndex.value =
    (selectedIndex.value + props.items.length - 1) % props.items.length;
};

const downHandler = () => {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
};

const enterHandler = () => {
  selectItem(selectedIndex.value);
};

const selectItem = (index) => {
  const item = props.items[index];
  if (item) {
    props.command(item);
  }
};
const chooseImg = (e, index: number) => {
  // uploadImage(e.target.files[0], uploadToken.value, mimeType, (url: string) => {
  //   props.items[index].props = { url: url };
  //   console.log(props.items[index]);
  //   props.command(props.items[index]);
  //   // editorInfo.value?.chain().focus().deleteRange(range).setImage({ src: url });
  // });
  let mimeType = ["image/png", "image/jpeg", "image/svg+xml"];
  let file = e.target.files[0];
  getBase64(file)
    .then((res) => {
      console.log(res);
      props.items[index].props = { url: res, index: 0, type: "create" };
      props.command(props.items[index]);
      setLoading(true);
      uploadFile(
        file,
        mimeType,
        (url: string) => {
          setLoading(false);
          props.items[index].props = { url: url, index: 0 };
          props.command(props.items[index]);
          // editorInfo.value?.chain().insertContent(`<img src="${url}">`).run();
        },
        route.params.id !== "create" ? (route.params.id as string) : ""
      );
    })
    .catch((err) => {
      console.log(err);
    });
};
watch(
  () => props.items,
  () => {
    selectedIndex.value = 0;
  }
);
defineExpose({
  onKeyDown,
});
</script>
<template>
  <div class="items">
    <div
      class="item dp-space-center"
      v-for="(item, index) in props.items"
      :key="'tab' + index"
      @click="item.title !== 'img' ? selectItem(index) : ''"
      :style="
        selectedIndex === index
          ? { backgroundColor: '#fff' }
          : ''
      "
    >
      <template v-if="item.title !== 'img'">
        <p-icon :name="item.title" :size="32" />
        <div class="title">{{ item.title }}</div>
      </template>
      <template v-else>
        <input
          type="file"
          accept="image/*"
          @change="chooseImg($event, index)"
          class="upload-img"
        />
        <p-icon name="image" :size="32" />
        <div class="title">{{ item.title }}</div>
      </template>
    </div>
  </div>
</template>
<style scoped lang="scss">
.items {
  width: 200px;
  position: relative;
  border-radius: 10px;
  background-color: var(--diary-bg-color);
  color: var(--diary-font-color);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.item {
  width: 100%;
  height: 30px;
  padding: 0px 10px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  .img {
    width: 18px;
    height: 18px;
  }
  .title {
    color: #9c9c9c;
    font-size: 14px;
  }
  &:hover {
    background-color:#fff;
  }
  .upload-img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 5;
    overflow: hidden;
    opacity: 0;
    cursor: pointer;
  }
}
</style>
<style lang="scss"></style>
