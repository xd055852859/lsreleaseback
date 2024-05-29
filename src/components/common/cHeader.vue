<script setup lang="ts">
const props = defineProps<{
  title: string;
  backPath?: string;
  type?: string;
  noTitle?: boolean;
  isBackOther?: boolean;
}>();
const emits = defineEmits<{
  (e: "backOther"): void;
}>();
</script>
<template>
  <div className="header">
    <div
      v-if="backPath || isBackOther"
      @click="
        isBackOther
          ? emits('backOther')
          : backPath
          ? $router.push(backPath)
          : null
      "
      class="icon-point q-mr-sm"
    >
      <q-icon name="navigate_before" size="32px" />
    </div>
    <div v-else class="dp-center-center"></div>
    <div className="header-title single-to-long">
      <template v-if="!noTitle">{{ title }}</template>
    </div>
    <slot name="subtitle"></slot>
    <q-space />
    <slot name="button"></slot>
  </div>
</template>
<style scoped lang="scss">
.header {
  width: 100%;
  height: 60px;
  padding: 0px 15px;
  box-sizing: border-box;
  line-height: 60px;
  @include flex(space-between, center, null);
  .header-title {
    max-width: 50%;
    font-size: 18px;
    font-weight: 600;
    color: #000000;
    @include flex(flex-start, center, null);
  }
}
</style>
<style lang="scss"></style>