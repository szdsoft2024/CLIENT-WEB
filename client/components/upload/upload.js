import upload from "./upload.vue";
import { createVNode, render } from "vue";

let ctx;

/**
 * 上传组件
 * @param {string}      title: "弹窗名",
 * @param {string}      url: '上传地址' eg: '/core/sys/user/import'
 * @param {string}      TMCode: 下载模板 模板code eg: TM_IMPORT_USER
 * @param {string}      fileExt 文件类型 如: ".xls,.xlsx", ".png"
 */
export function szdUpload(title, url, TMCode, fileExt) {
  return new Promise((resolve, reject) => {
    let resolveFlag = false;
    const data = { title: title, uploadUrl: url, TMCode: TMCode, accept: fileExt };
    const div = document.createElement("div");
    const vNode = createVNode(upload, {
      updParams: data,
      initByJs: true,
      onUploadSuccess: res => {
        resolve(res);
        resolveFlag = true;
      },
      onUploadError: res => {
        reject(res);
        resolveFlag = true;
      },
      onCloseDialog: () => {
        if (!resolveFlag) {
          resolve(false);
        }
        document.body.removeChild(div);
      }
    });
    vNode.appContext = ctx;
    document.body.appendChild(div);
    render(vNode, div);
  });
}

/**
 * 设置上下文
 */
const setShUpload = function (app) {
  ctx = app._context;
};

export default setShUpload;
