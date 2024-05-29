<script setup lang="ts">
const props = defineProps<{
  name?: string;
  color?: string;
  fillColor?: string;
  size: number;
  iconStyle?: any;
}>();
</script>
<template>
  <iconpark-icon
    :name="name"
    :size="size"
    :color="color ? color : '#333'"
    :fillColor="fillColor"
  />
</template>
<style scoped lang="scss"></style>
<style></style>
