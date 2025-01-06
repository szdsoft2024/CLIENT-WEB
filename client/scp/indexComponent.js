//功能按钮
import scpButton from "./scpButton/scpButton.vue";
//业务主体信息
import scpBussBase from "./scpButton/scpBussBase.vue";

const installScpComponent = app => {
  app.component("szd-scp-fm-button", scpButton);
  app.component("szd-scp-fm-bussBase", scpBussBase);
};
export default installScpComponent;
