function emptyAction() {
}

function Actions() {
  this.actions = {
    onGlobalStateChange: emptyAction,
    setGlobalState: emptyAction
  };
}

// 设置乾坤方法
Actions.prototype.setActions = function(actions) {
  this.actions = actions;
};

// 监听应用状态
Actions.prototype.onGlobalStateChange = function(actions) {
  return this.actions.onGlobalStateChange(...arguments);
};

// 发送应用状态
Actions.prototype.setGlobalState = function(actions) {
  return this.actions.setGlobalState(...arguments);
};

const actions = new Actions();

export default actions;
