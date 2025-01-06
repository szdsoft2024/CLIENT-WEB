<template>
  <!-- 城市搜索帮助    -->
  <div v-if="!_fst.hide" style="width: 100%; height: 100%">
    <el-cascader
      v-model="_modelValue"
      :options="_options"
      key="city"
      placeholder=""
      :props="{ expandTrigger: 'hover', emitPath: false }"
      :clearable="clearable"
      :show-all-levels="false"
      :disabled="_fst.disabled"
      @change="handleChange"
      popper-class="szd-el-cascader" />
  </div>
</template>

<script setup>
  import { defineProps, defineEmits, computed, ref, onMounted } from "vue";
  import { useStore } from "vuex";
  import { getCityList } from "../api/searchHelpCity";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    modelValue: {
      type: [String, Number]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
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

  onMounted(() => {
    initData();
  });

  //初始化单选数据
  const initData = () => {
    getCity();
  };

  //获取城市信息
  const getCity = () => {
    //获取Vuex数据
    const store = useStore();
    const vuexGroup = store.state.vuexData.group;
    if (vuexGroup && vuexGroup["$SZD_CITY"]) {
      _options.value = vuexGroup["$SZD_CITY"];
    } else {
      getCityList().then(res => {
        if (res.code === 200) {
          _options.value = res.data;
          //Vuex存储数据
          store.dispatch("setVuexDataGroup", { key: "$SZD_CITY", value: _options.value });
        } else {
          console.error("地区查询报错" + res.msg);
        }
      });
    }
  };

  //更改事件
  const handleChange = v => {
    emit("change", v);
  };
</script>

<style>
  .szd-el-cascader {
    border-radius: 2px;
  }

  .szd-el-cascader .el-cascader-panel {
    font-size: $fz;
  }

  .szd-el-cascader .el-cascader-node {
    height: 30px;
    line-height: 30px;
  }
</style>
