import { createVNode, render } from "vue";
import fileViewDialog from "./fileViewDialog.vue";
import { $m } from "../../common/utils/globalConfig";

let ctx;

/**
 * 文件预览
 * @param {String} src 文件地址
 * @param {String} srcBlob bold文件地址
 * @param {String} fileName 文件名称行后缀
 * @param {Boolean} isBlob 字节流显示
 */
export function szdFileView({ src = "", srcBlob = "", fileName = "", isBlob = false }) {
  if (!src && !srcBlob) return;
  //检查文件类型，确定使用插件
  let _fileName = fileName ? fileName : src;
  if (!szdGetFileType(_fileName)) {
    $m("CORE_CLIENT.W013"); //不支持的文件类型在线查看, 请下载后查看
    return;
  }
  //检查是否支持字节流
  if (srcBlob) {
    if (!szdGetFileBlobType(_fileName)) {
      $m("CORE_CLIENT.W013"); //不支持的文件类型在线查看, 请下载后查看
      return;
    }
  }
  //预览文件
  return new Promise(resolve => {
    const div = document.createElement("div");
    const vNode = createVNode(fileViewDialog, {
      src: src,
      srcBlob: srcBlob,
      fileName: fileName,
      isBlob: isBlob,
      onCloseForm: () => {
        resolve(true);
        document.body.removeChild(div);
      }
    });
    vNode.appContext = ctx;
    document.body.appendChild(div);
    render(vNode, div);
  });

  // 直接挂载在全局下的写法
  // return new Promise(resolve => {
  //   const div = document.createElement("div");
  //   const constructor = createApp(fileViewDialog, {
  //     close: () => {
  //       constructor.unmount(mountDiv);
  //       document.body.removeChild(mountDiv);
  //     }
  //   });
  //   constructor.use(ElementPlus);
  //   const instance = constructor.mount(mountDiv);
  //   instance.preUrl = urlPath;
  //   instance.fileType = fileType;
  //   instance.dialogParams.open = true;
  //   document.body.appendChild(mountDiv);
  // });
}

/**
 * 根据地址或文件名称获取文件类型
 * @param {String} fileName 地址或文件名称
 * @return 文件类型
 */
export function szdGetFileType(fileName) {
  if (!fileName) return "";
  const fileExt = fileName.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "bmp", "tiff"].includes(fileExt)) {
    return "img";
  } else if (fileExt === "xls") {
    return "xls";
  } else if (fileExt === "xlsx") {
    return "xlsx";
  } else if (fileExt === "docx") {
    return "docx";
  } else if (fileExt === "pdf") {
    return "pdf";
  } else if (fileExt === "txt") {
    return "txt";
  } else if (["avi", "wmv", "mpeg", "mpg", "mov", "mp4"].includes(fileExt)) {
    return "video";
  } else {
    return "";
  }
}

/**
 * 根据地址获取下载方式
 * @param {String} fileName 地址或文件名称
 * @return 文件类型
 */
export function szdGetFileBlobType(fileName) {
  if (!fileName) return "";
  const fileExt = fileName.split(".").pop().toLowerCase();
  if (fileExt === "xls") {
    return "application/vnd.ms-excel";
  } else if (fileExt === "xlsx") {
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  } else if (fileExt === "docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  } else if (fileExt === "pdf") {
    return "application/pdf";
  } else if (fileExt === "txt") {
    return "text/plain";
  } else if (fileExt === "png") {
    return "image/png";
  } else if (["jpg", "jpeg"].includes(fileExt)) {
    return "image/jpeg";
  } else if (["avi", "wmv", "mpeg", "mpg", "mov", "mp4"].includes(fileExt)) {
    return "video";
  } else {
    return "";
  }
}

/**
 * 设置上下文
 */
const setFileView = function (app) {
  ctx = app._context;
};

export default setFileView;
