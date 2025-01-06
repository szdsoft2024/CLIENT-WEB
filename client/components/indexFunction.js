//搜索帮助
import setShApp, { szdSh, szdShShow } from "./searchHelp/serchHelp";
//消息提醒
import setMsgBox, { szdMsgBox } from "./msgBox/msgBox";
//iframe弹窗
import { szdIfrDg } from "./ifrDg/ifrDg.js";
//上传文件
import setShUpload, { szdUpload } from "./upload/upload";
//文件预览
import setFileView, { szdGetFileType, szdFileView, szdGetFileBlobType } from "./fileView/fileView";
//基础映射关系
import setBaseMap, { szdBaseMapCheck, szdBaseMapHelp, szdBaseMapMove } from "./baseMap/baseMap";

const installComponentFunction = app => {
  //搜索帮助
  setShApp(app);
  app.config.globalProperties.szdSh = szdSh;
  app.config.globalProperties.szdShShow = szdShShow;
  //消息提醒
  setMsgBox(app);
  app.config.globalProperties.szdMsgBox = szdMsgBox;
  //iframe弹窗
  app.config.globalProperties.szdIfrDg = (routerCode, params = {}) => {
    szdIfrDg.apply(app, [routerCode, params]).then();
  };
  //上传文件
  setShUpload(app);
  app.config.globalProperties.szdUpload = szdUpload;
  //文件预览
  setFileView(app);
  app.config.globalProperties.szdFileView = szdFileView;
  app.config.globalProperties.szdFileViewType = szdGetFileType;
  app.config.globalProperties.szdFileBlobType = szdGetFileBlobType;
  //基础映射关系
  setBaseMap(app);
  app.config.globalProperties.szdBaseMapHelp = szdBaseMapHelp;
  app.config.globalProperties.szdBaseMapMove = szdBaseMapMove;
  app.config.globalProperties.szdBaseMapCheck = szdBaseMapCheck;
};

export default installComponentFunction;
