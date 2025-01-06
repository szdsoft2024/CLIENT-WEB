<template>
  <div v-if="!_fst.hide" style="width: 100%; height: 100%">
    <el-radio-group v-model="_modelValue" class="radio-group-box" @change="handleChange" :disabled="_fst.disabled">
      <el-radio v-for="(item, index) in _options" :key="index" :label="item.svalue">
        {{ item.sname }}
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script setup>
  import { defineProps, defineEmits, computed, ref, onMounted, watch } from "vue";
  import { useStore } from "vuex";
  import { selectBaseView } from "../api/selectOption";
  import szdStoreLocal from "../../common/store/storeLocal";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    modelValue: {
      type: [String, Number, Boolean]
    },
    //基础字段
    baseField: {
      type: String,
      default: ""
    },
    //单选数组[{svalue:"",sname:""}]
    baseArr: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    //默认首个
    first: {
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
    if (props.baseArr && Array.isArray(props.baseArr) && props.baseArr.length > 0) {
      _options.value = props.baseArr; //数据范围-来源前端
      getSvalName();
    } else if (props.baseField) {
      getBaseField(props.baseField); //数据范围-基础字段
    } else {
      console.error("radio数据范围请输入baseArr或baseField");
    }
  };
  //数据范围-基础字段
  const getBaseField = baseField => {
    //获取localStorage数据
    const localDict = szdStoreLocal.getDict();
    if (localDict && localDict[baseField]) {
      _options.value = localDict[baseField];
      getSvalName();
    } else {
      //获取Vuex数据
      const store = useStore();
      const vuexBase = store.state.vuexData.dict;
      if (vuexBase && vuexBase[baseField]) {
        _options.value = vuexBase[baseField];
        getSvalName();
      } else {
        //获取实时数据
        selectBaseView({ baseField: baseField, _paramGroup: [] }).then(res => {
          if (res.code === 200) {
            _options.value = res.data;
            getSvalName();
            //Vuex存储数据
            store.dispatch("setVuexDataDict", { baseField: baseField, options: _options.value });
          } else {
            console.error("基础字段" + baseField + "查询报错" + res.msg);
          }
        });
      }
    }
  };

  //数据显示处理
  const getSvalName = () => {
    if (props.first && !_modelValue.value) {
      if (Array.isArray(_options.value) && _options.value.length > 0) {
        _modelValue.value = _options.value[0].svalue;
      }
    }
  };

  //更改事件
  const handleChange = v => {
    emit("change", v);
  };
</script>

<style lang="scss" scoped>
  .radio-group-box {
    width: 100%;
    height: 100%;
    padding-left: 10px;
    display: flex;
    align-items: center;
  }
</style>
