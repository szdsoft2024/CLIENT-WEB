import { createVNode, render } from "vue";
import ifrDgVue from "./ifrDg.vue";
import szdRouter from "../../common/utils/goRouter";
import { app } from "~main";

/**
 * 动态加载路由
 * @param {String} routerCode 路由代码
 * @param {Object} params 请求参数
 * @param {Object} winSetting 窗口设置 {width宽度 height高度 title 标题}
 */
export function szdIfrDg(routerCode, params = {}, winSetting = {}) {
  return new Promise(resolve => {
    //获取路由对象
    const routerObj = szdRouter.getRouterObj(routerCode);

    if (routerObj && routerCode) {
      //计算弹窗最大层级
      // let zIndexMax = 100;
      // const allLayers = document.querySelectorAll(".el-overlay");
      // allLayers.forEach(item => {
      //   if (zIndexMax < Number(item.style.zIndex)) zIndexMax = Number(item.style.zIndex);
      // });
      //按照优先级设置窗口参数(1.传参 2.路由配置 3.默认)
      const w = winSetting.width ? winSetting.width : routerObj.iframeWidth ? routerObj.iframeWidth : "95%"; //宽度
      const h = winSetting.height ? winSetting.height : routerObj.iframeHeight ? routerObj.iframeHeight : "85%"; //高度
      const title = winSetting.title || routerObj.iframeTitle || routerObj.routerName; //标题
      //加载窗口
      const div = document.createElement("div");
      const vNode = createVNode(ifrDgVue, {
        routerCode: routerCode,
        params: params,
        title: title,
        width: w,
        height: h,
        // zIndex: zIndexMax + 1,
        onCloseDialog: () => {
          if (!routerObj.iframeVue) {
            document.body.removeChild(div.nextElementSibling);
            document.body.removeChild(div);
          } else {
            if (div.nextElementSibling.nextElementSibling) {
              document.body.removeChild(div.nextElementSibling.nextElementSibling);
            }
            if (div.nextElementSibling) {
              document.body.removeChild(div.nextElementSibling);
            }
            document.body.removeChild(div);
          }
        }
      });
      vNode.appContext = this ? this._context : app._context;
      // 3. 准备一个DOM容器 把虚拟节点渲染DOM容器中

      // 添加到body上
      document.body.appendChild(div);
      render(vNode, div);
    }
    resolve(true);
  });
}
