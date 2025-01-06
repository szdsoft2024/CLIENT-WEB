<template>
  <template v-if="!_fst.hide">
    <template v-if="_checkboxGroup">
      <div :class="_checkboxAll === 'top' ? 'check-group-box-top' : 'check-group-box-left'">
        <div v-if="_checkboxAll" :class="_checkboxAll === 'top' ? '' : 'check-group-box-left-chk'">
          <el-checkbox v-model="_checkAll" :indeterminate="_isIndeterminate" :disabled="_fst.disabled" @change="handleChangeCheckAll">
            {{ $t("全选") }}
          </el-checkbox>
        </div>
        <div>
          <el-checkbox-group v-model="_modelValue" :disabled="_fst.disabled" :min="min" :max="max" @change="handleChange">
            <el-checkbox v-for="item in _options" :value="item.svalue" :label="item.svalue">{{ item.sname }} </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </template>
    <template v-else>
      <el-checkbox v-model="_modelValue" :label="boxLabel" :disabled="_fst.disabled" @change="handleChange" />
    </template>
  </template>
</template>
<script setup>
  import { defineProps, defineEmits, computed, onMounted, ref, watch } from "vue";
  import { useStore } from "vuex";
  import { selectBaseView } from "../api/selectOption";
  import szdStoreLocal from "../../common/store/storeLocal";
  import { $t } from "../../common/utils/globalConfig";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    //单复选框数据类型：[String, Number, Boolean],返回值都是bool
    //多复选框数据类型 [Array]
    modelValue: {
      type: [String, Number, Boolean, Array]
    },
    //单复选框 标签名称
    boxLabel: {
      type: String,
      default: ""
    },
    //多复选框 基础字段
    baseField: {
      type: String,
      default: ""
    },
    //多复选框 数组[{svalue:"",sname:""}]
    baseArr: {
      type: Array,
      default: () => []
    },
    //多复选框 最大选择数
    max: {
      type: Number
    },
    //多复选框 最小选择数
    min: {
      type: Number
    },
    //多复选框 显示全选 top 显示在上边 left 在左边 与 max 和 min不能同时使用
    checkboxAll: {
      type: String
    },
    //多复选框 + 单复选框
    disabled: {
      type: Boolean,
      default: false
    },
    szdfst: {
      type: String
    },
    szdopt: {
      type: String
    }
  });
  //定义事件
  const emit = defineEmits(["update:modelValue", "change"]);
  //检查是否未数组
  const _checkboxGroup = computed(() => {
    if ((Array.isArray(props.baseArr) && props.baseArr.length > 0) || props.baseField) {
      return true;
    } else {
      return false;
    }
  });
  const _checkboxAll = computed(() => {
    if (props.max > 0 || props.min > 0) {
      return "";
    } else {
      return ["top", "left"].includes(props.checkboxAll) ? props.checkboxAll : "";
    }
  });
  //值数据
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });
  //编辑状态
  const _fst = computed(() => {
    return szdComp.getCompFst(props.szdfst, props.szdopt, props.disabled);
  });
  //数据范围
  const _options = ref([]);
  //全选参数
  const _checkAll = ref(false);
  const _isIndeterminate = ref(false);

  //监听值数据
  watch(
    () => [props.baseArr, props.baseField],
    () => {
      initData();
    }
  );

  onMounted(() => {
    initData();
  });
  //初始化单选数据
  const initData = () => {
    if (_checkboxGroup.value) {
      if (props.baseArr && Array.isArray(props.baseArr) && props.baseArr.length > 0) {
        _options.value = props.baseArr; //数据范围-来源前端
      } else if (props.baseField) {
        getBaseField(props.baseField); //数据范围-基础字段
      } else {
        console.error("checkbox的数据范围请输入darr或baseField");
      }
    }
  };
  //数据范围-基础字段
  const getBaseField = baseField => {
    //获取localStorage数据
    const localDict = szdStoreLocal.getDict();
    if (localDict && localDict[baseField]) {
      _options.value = localDict[baseField];
    } else {
      //获取Vuex数据
      const store = useStore();
      const vuexBase = store.state.vuexData.dict;
      if (vuexBase && vuexBase[baseField]) {
        _options.value = vuexBase[baseField];
      } else {
        //获取实时数据
        selectBaseView({ baseField: baseField, _paramGroup: [] }).then(res => {
          if (res.code === 200) {
            _options.value = res.data;
            //Vuex存储数据
            store.dispatch("setVuexDataDict", { baseField: baseField, options: _options.value });
          } else {
            console.error("基础字段" + baseField + "查询报错" + res.msg);
          }
        });
      }
    }
  };

  //更改事件
  const handleChange = v => {
    if (_checkboxGroup) {
      const count = v.length;
      _checkAll.value = count === _options.value.length;
      _isIndeterminate.value = count > 0 && count < _options.value.length;
    }
    emit("change", v);
  };

  //设置全选或取消选择
  const handleChangeCheckAll = v => {
    _modelValue.value = [];
    if (v) {
      for (let i = 0; i < _options.value.length; i++) {
        _modelValue.value.push(_options.value[i].svalue);
      }
      emit("update:modelValue", _modelValue.value);
    }
    _isIndeterminate.value = false;
    emit("change", v);
  };
</script>
<style lang="scss" scoped>
  .check-group-box-top {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .check-group-box-left {
    width: 100%;
    display: flex;

    .check-group-box-left-chk {
      padding-right: 20px;
    }
  }
</style>
