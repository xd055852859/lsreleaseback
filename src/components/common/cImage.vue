<script setup lang="ts">
const props = defineProps<{
  src: string;
  list?: string[];
  isPreview?: boolean;
}>();
const emits = defineEmits<{
  close: [];
}>();
const imgVisible = ref<boolean>(false);
</script>
<template>
  <img
    :src="src"
    alt=""
    @click="isPreview ? (imgVisible = true) : null"
    class="common-img"
  />
  <q-dialog
    v-model="imgVisible"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <div class="common-img-large" @click="imgVisible = false">
      <img :src="src" alt="" />
    </div>
  </q-dialog>
</template>
<style scoped lang="scss">
.common-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}
.common-img-large {
  width: 100vw;
  height: 100vh;
  @include flex(center, center, null);
  img {
    width: 70%;
    height: 70%;
    object-fit: contain;
  }
}
</style>
<style lang="scss"></style>
