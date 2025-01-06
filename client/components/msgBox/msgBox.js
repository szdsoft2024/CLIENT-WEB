import { createVNode, render } from "vue";
import msgBox from "./msgBox.vue";

let ctx;

/**
 * 消息弹窗
 *
 * @param {Array} msg 以下是对象说明 [{light:指示灯,retCode:消息码,retMsg:消息内容}]
 * light:指示灯 枚举：1.红灯 2.黄灯 3.绿灯 其它灰灯
 * retCode:消息码
 * retMsg:消息内容
 */
export function szdMsgBox(msg) {
  return new Promise(resolve => {
    if (msg && msg.length > 0) {
      const div = document.createElement("div");
      const vNode = createVNode(msgBox, {
        msg: msg,
        onCloseForm: () => {
          resolve(true);
          document.body.removeChild(div);
        }
      });
      vNode.appContext = ctx;
      document.body.appendChild(div);
      render(vNode, div);
    } else {
      resolve(true);
    }
  });
}

/**
 * 设置上下文
 */
const setMsgBox = function (app) {
  ctx = app._context;
};

export default setMsgBox;
