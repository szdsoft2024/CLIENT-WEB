//工作流按钮组件
import wfButton from "./wfButton/wfButton.vue";
//业务主体信息-页面按钮
import wfBussBaseButton from "./wfBussBase/wfBussBaseButton.vue";

const installWfComponent = app => {
  app.component("szd-wf-button", wfButton);
  app.component("szd-wf-bussBase-button", wfBussBaseButton);
};
export default installWfComponent;
