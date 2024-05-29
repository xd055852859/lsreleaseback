<script setup lang="ts">

// const getDomain = async (codeName) => {
//   const domainRes = (await api.request.get("client/byCodeName", {
//     codeName: codeName,
//   })) as ResultProps;
//   if (domainRes.msg === "OK") {
//     request.setDomainKey(domainRes.data._key);
//     request.setRegionCode(domainRes.data.regionCode);
//     setDomain(domainRes.data);
//     //@ts-ignore
//     document.querySelector('link[rel="icon"]').href = domainRes.data.logo;
//     document.title = domainRes.data.name;
//     setCodeName(codeName);
//   }
// };
// watch(
//   () => props.codeName,
//   (newName) => {
//     if (newName) {
//       getDomain(newName);
//     }
//   },
//   { immediate: true }
// );
</script>
<template> <router-view></router-view></template>
<style scoped lang="scss"></style>
<style lang="scss"></style>
