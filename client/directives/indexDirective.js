//弹窗大小设置, 可拖动位置, 可拖动大小
import dialog from "./dialog/dialog.js";

const installDirective = app => {
  app.directive("szd-dialog", dialog);
};

export default installDirective;
