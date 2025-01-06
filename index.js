//监听路由跳转
import "./client/common/utils/permission";
//common组件
import installCommonFunction from "./client/common/indexFunction";
//components组件
import installComponent from "./client/components/indexComponent";
import installComponentFunction from "./client/components/indexFunction";
//指令
import installDirective from "./client/directives/indexDirective";
//工作流
import installWfComponent from "./client/wf/indexComponent";
import installWfFunction from "./client/wf/indexFunction";
//零代码
import installScpFunction from "./client/scp/indexFunction";
import installScpComponent from "./client/scp/indexComponent";

//固定svg图标加载
const req = require.context("./client/assets/icons/svg", false, /.svg$/);
req.keys().forEach(svg => {
  req(svg);
});

const installDependency = app => {
  installCommonFunction(app);
  installComponent(app);
  installComponentFunction(app);
  installDirective(app);
  installWfComponent(app);
  installWfFunction(app);
  installScpComponent(app);
  installScpFunction(app);
};

export default installDependency;