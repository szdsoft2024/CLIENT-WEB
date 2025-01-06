//view->actions->mutations->state->view  view通过dispatch提交到actions，actions通过commit提交到mutations，并最终修改state中的数据
const vuexData = {
  state: {
    dict: {}, //数据字典
    group: {} //数据组
  },
  mutations: {
    SET_DICT: (state, data) => {
      state.dict[data.baseField] = data.options;
    },
    SET_GROUP: (state, obj) => {
      state.group[obj.key] = obj.value;
    },
    DEL_GROUP: (state, key) => {
      delete state.group[key];
    }
  },
  actions: {
    //设置数据字典
    setVuexDataDict({ commit }, data) {
      commit("SET_DICT", data);
    },
    //设置数据组
    setVuexDataGroup({ commit }, data) {
      commit("SET_GROUP", data);
    },
    //删除数据组
    delVuexDataGroup({ commit }, data) {
      commit("DEL_GROUP", data);
    }
  }
};

export default vuexData;
