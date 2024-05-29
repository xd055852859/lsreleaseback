<script setup lang="ts">
import pIcon from "@/components/common/pIcon.vue";
const props = defineProps<{
  itemObj: { [key: string]: string | number };
  itemHeight: number;
}>();
const emits = defineEmits(["close", "chooseNode"]);

const insertNode = (type) => {
  console.log(type);
  emits("chooseNode", type);
  emits("close");
};
</script>
<template>
  <div class="block-item">
    <div @click="insertNode('h1')" class="button dp--center">
      <p-icon name="H1" :size="35" />
      H1
    </div>
    <div @click="insertNode('h2')" class="button dp--center">
      <p-icon name="H2" :size="35" />
      H2
    </div>
    <div @click="insertNode('h3')" class="button dp--center">
      <p-icon name="H3" :size="35" />
      H3
    </div>
    <div @click="insertNode('bulletList')" class="button dp--center">
      <p-icon name="bulletList" :size="35" />
      bulletList
    </div>
    <div @click="insertNode('orderList')" class="button dp--center">
      <p-icon name="orderedList" :size="35" />
      orderedList
    </div>
    <div @click="insertNode('taskList')" class="button dp--center">
      <p-icon name="taskList" :size="35" />
      taskList
    </div>
    <div @click="insertNode('divider')" class="button dp--center">
      <p-icon name="horizontalRule" :size="35" />
      horizontalRule
    </div>
    <div @click="insertNode('blockquote')" class="button dp--center">
      <p-icon name="blockquote" :size="35" />
      blockquote
    </div>
    <div @click="insertNode('code')" class="button dp--center">
      <p-icon name="code" :size="35" />
      code
    </div>
    <div @click="insertNode('codeBlock')" class="button dp--center">
      <p-icon name="codeblock" :size="35" />
      codeblock
    </div>
  </div>
</template>
<style scoped lang="scss">
.block-item {
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--talk-bg-color);
  div {
    width: 100%;
    height: 50px;
    padding: 0px 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
      margin-right: 15px;
    }
    &:hover {
      background-color: #c9c9c9;
    }
  }
}
</style>
<style></style>
