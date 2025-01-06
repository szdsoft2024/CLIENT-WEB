import { createVNode, render } from "vue";
import baseMapHelp from "./baseMapHelp.vue";
import baseMapMove from "./baseMapMove.vue";
import baseMapCheck from "./baseMapCheck.vue";

let ctx;

/**
 * 搜索帮助映射
 */
export function szdBaseMapHelp(baseMap, baseArr) {
  return new Promise(resolve => {
    let resolveFlag = false;
    const div = document.createElement("div");
    const vNode = createVNode(baseMapHelp, {
      baseMap: baseMap,
      baseArr: baseArr,
      onOkay: retObj => {
        resolve(retObj);
        resolveFlag = true;
      },
      onCloseForm: () => {
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
 * 数据检查
 */
export function szdBaseMapCheck(baseMap, baseArr) {
  return new Promise(resolve => {
    let resolveFlag = false;
    const div = document.createElement("div");
    const vNode = createVNode(baseMapCheck, {
      baseMap: baseMap,
      baseArr: baseArr,
      onOkay: retObj => {
        resolve(retObj);
        resolveFlag = true;
      },
      onCloseForm: () => {
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
 * 映射赋值
 */
export function szdBaseMapMove(baseMap, baseArr) {
  return new Promise(resolve => {
    let resolveFlag = false;
    const div = document.createElement("div");
    const vNode = createVNode(baseMapMove, {
      baseMap: baseMap,
      baseArr: baseArr,
      onOkay: retObj => {
        resolve(retObj);
        resolveFlag = true;
      },
      onCloseForm: () => {
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
const setBaseMap = function (app) {
  ctx = app._context;
};

export default setBaseMap;
