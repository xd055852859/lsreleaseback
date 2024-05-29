import * as qiniu from "qiniu-js";
import { JSONContent } from "@tiptap/vue-3";
import api from "@/services/api";
import { setLoading } from "./common";
const DOMAIN = import.meta.env.VITE_QINIU_CDN;
let singleSizeLimit = 0;

interface Api {
  url: string;
  params: any;
  responseName?: string;
  docDataName?: string;
}

export const is_mobile = () => {
  let regex_match =
    /(nokia|iphone|iPad|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220|Mobile)/i;
  let u = navigator.userAgent;
  if (null == u) {
    return true;
  }
  let result = regex_match.exec(u);

  if (null == result) {
    return false;
  } else {
    return true;
  }
};

export const guid = (len?: number, radix?: number) => {
  let chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  let uuid: string[] = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join("");
};

export function getFileTypeByName(name: string) {
  const fileExtension = name.split(".").pop();
  if (
    fileExtension === "jpg" ||
    fileExtension === "png" ||
    fileExtension === "jpeg"
  ) {
    return "image/*";
  } else if (
    fileExtension === "mp3" ||
    fileExtension === "aac" ||
    fileExtension === "wav"
  ) {
    return "audio/*";
  } else if (fileExtension === "mp4") {
    return "video/*";
  } else if (fileExtension === "pdf") {
    return "application/pdf";
  } else if (
    fileExtension === "docx" ||
    fileExtension === "doc" ||
    fileExtension === "xls" ||
    fileExtension === "xlsx" ||
    fileExtension === "ppt" ||
    fileExtension === "pptx"
  ) {
    return "application/msword";
  } else {
    return "unknow";
  }
}

export function download(url: string, fileName: string) {
  fetch(url).then((res) =>
    res.blob().then((blob) => {
      var a = document.createElement("a");
      var url = window.URL.createObjectURL(blob);
      var filename = fileName;
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  );
}

export function getDefaultLanguage() {
  const languages = ["zh-TW", "ja", "zh-CN", "zh", "en"];
  const localStorageLan = localStorage.getItem("LOCALE");
  if (localStorageLan && languages.includes(localStorageLan)) {
    return localStorageLan;
  } else {
    const systemLan = navigator.language;
    if (systemLan && languages.includes(systemLan)) {
      localStorage.setItem("LOCALE", systemLan);
      return systemLan;
    } else {
      return "en";
    }
  }
}

/**
 * 判断是否是絵文字
 * @param str
 * @returns
 */
export function isEmoji(str?: string) {
  return str
    ? /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g.test(
        str
      )
    : false;
}

// 获取随机数
export function randomNum(minNum: number, maxNum: number) {
  switch (arguments.length) {
    case 1:
      // @ts-ignore
      return parseInt(Math.random() * minNum + 1, 10);
    case 2:
      // @ts-ignore
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    default:
      return 0;
  }
}

export function isOutline(json: JSONContent): boolean {
  let outline = false;
  const content = json.content;
  for (let index = 0; content && index < content.length; index++) {
    const item = content[index];
    if (item.type === "bulletList" || item.type === "orderedList") {
      outline = true;
      return outline;
    }
    outline = isOutline(content);
    if (outline) {
      return outline;
    }
  }
  return outline;
}
export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    ///FileReader类就是专门用来读文件的
    const reader = new FileReader();
    //开始读文件
    //readAsDataURL: dataurl它的本质就是图片的二进制数据， 进行base64加密后形成的一个字符串，
    reader.readAsDataURL(file);
    // 成功和失败返回对应的信息，reader.result一个base64，可以直接使用
    reader.onload = () => resolve(reader.result);
    // 失败返回失败的信息
    reader.onerror = (error) => reject(error);
  });
};

