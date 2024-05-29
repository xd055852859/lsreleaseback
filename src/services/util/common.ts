import { Notify, Loading,Dialog } from "quasar";
import api from "../api";
import { ResultProps } from "@/interface/Common";
export const setMessage = (type: string, text: string) => {
  let icon: string = "";
  let color: string = "";
  switch (type) {
    case "success":
      icon = "done";
      color = "positive";
      break;
    case "error":
      icon = "error";
      color = "negative";
      break;
    case "warning":
      icon = "warning";
      color = "warning";
      break;
  }
  Notify.create({
    icon: icon,
    color: color,
    message: text,
    position: "top",
    badgeStyle: { display: "none" },
  });
};
export const setLoading = (visible: boolean) => {
  visible ? Loading.show() : Loading.hide();
};
export const commonscroll = (e, list, total, callback) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let height = e.target.clientHeight;
  console.log(height + scrollTop)
  console.log(scrollHeight)
  console.log(list.length)
  console.log(total)
  if (height + scrollTop >= scrollHeight && list.length < total) {
    callback();
  }
};
export const commonDelete = (apiName, key,value, callback) => {
  Dialog.create({
    title: "删除数据",
    message: "是否确认删除该数据",
    cancel: {
      color: "grey-5",
      flat: true,
    },
  })
    .onOk(async () => {
      const delRes = (await api.request.delete(apiName, {
        [key]: value,
      })) as ResultProps;
      if (delRes.msg === "OK") {
        setMessage("success", "删除数据成功");
        callback();
      }
    })
    .onCancel(() => {});
};
export const commonSave = async (apiName,key, info, callback) => {
  if (info._key) {
    let editRes = (await api.request.patch(apiName, {
      [key]: info._key,
      ...info,
    })) as ResultProps;
    if (editRes.msg === "OK") {
      callback(editRes.data);
    }
  } else {
    let addRes = (await api.request.post(apiName, {
      ...info,
    })) as ResultProps;
    if (addRes.msg === "OK") {
      setMessage("success", `${info._key ? "编辑" : "新增"}数据成功`);
      callback(addRes.data);
    }
  }
};
