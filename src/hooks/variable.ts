export const computerVariable = [
  { name: "--mountain-item-width", value: "180px" },
  { name: "--mountain-item-line", value: "5" },
];

export const phoneVariable = [
  { name: "--mountain-item-width", value: "120px" },
  { name: "--mountain-item-line", value: "2" },
];
export const variable = () => {
  // 主题颜色变量组
  // const themeList = ref([
  //   { name: "极光绿(默认)", value: "#16ab78" },
  //   { name: "拂晓蓝", value: "#409eff" },
  //   { name: "薄暮红", value: "#e74c3c" },
  //   { name: "火山橘", value: "#e67e22" },
  //   { name: "日暮黄", value: "#f1c40f" },
  //   { name: "酱紫", value: "#9b59b6" },
  // ]);
  // 明亮模式全局颜色
  const computerList = ref(computerVariable);
  // 暗黑模式全局颜色
  const phoneList = ref(phoneVariable);
  return {
    computerList,
    phoneList,
    //   themeList,
  };
};
