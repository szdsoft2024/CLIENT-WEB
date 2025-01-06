<template>
  <el-dialog
    :title="dg.title"
    v-model="dg.open"
    append-to-body
    @close="handleClose"
    class="app-dialog-container"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[950, 600]"></div>
    <!--  基础字段选择  -->
    <el-form class="app-el-form">
      <el-row>
        <szd-select-form-item-col
          label="消费场景"
          v-model="_baseMap.header.consScene"
          baseField="CORE_SCP_MP_SCENE"
          :span="12"
          :descSpan="12"
          disabled />
        <szd-input-form-item-col
          label="消费方"
          v-model="_baseMap.header.consKey"
          :span="12"
          :descSpan="12"
          :desc="_baseMap.header.consKeyName"
          disabled />
        <szd-input-form-item-col
          label="消费方数据表"
          v-model="_baseMap.header.consTable"
          :span="12"
          :descSpan="12"
          :desc="_baseMap.header.consTableName"
          disabled />
        <szd-input-form-item-col
          label="消费方字段"
          v-model="_baseMap.header.consField"
          :span="12"
          :descSpan="12"
          :desc="_baseMap.header.consFieldName"
          disabled />
        <szd-input-form-item-col label="数据类型" v-model="_baseMap.header.consFieldType" :span="12" :descSpan="12" disabled />
      </el-row>
      <el-row>
        <szd-select-form-item-col
          label="消费类型"
          v-model="_baseMap.header.consType"
          baseField="CORE_SCP_MP_BASE"
          :span="12"
          :descSpan="12"
          required
          first
          disabled
          @change="handleChangeType" />
        <szd-input-form-item-col
          label="服务方"
          v-model="_baseMap.header.servKey"
          :span="12"
          :descSpan="12"
          :desc="_baseMap.header.servKeyName"
          show-help
          :help="{ a: 'CORE_BASE', b: _baseMap.header, c: ['servKey-fieldCode', 'servKeyName-fieldName'] }"
          @change="handleChangeServKey"
          required
          readonly />
      </el-row>
    </el-form>
    <!-- 页标签信息-基础字段数据维护 -->
    <el-tabs v-model="dg.actTab" v-if="_baseMap.header.consType === 'A1'">
      <!--   查询条件   -->
      <el-tab-pane :label="$t('查询条件映射')" name="tab1">
        <baseMapSel v-model:baseMap="_baseMap" :baseArr="_baseArr" />
      </el-tab-pane>
      <!--   输出结果   -->
      <el-tab-pane :label="$t('输出结果映射')" name="tab2">
        <baseMapRet v-model:baseMap="_baseMap" :baseArr="_baseArr" />
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <szd-button label="重置" type="primary" @click="reSet" />
      <szd-button label="确定" type="primary" @click="okayForm" />
      <szd-button label="取消" type="primary" @click="handleCloseForm" />
    </template>
  </el-dialog>
</template>

<script setup>
  import _ from "lodash";
  import { $m, $t } from "../../common/utils/globalConfig";
  import { defineEmits, ref, defineProps, onMounted, computed } from "vue";
  import { getBaseField } from "../api/baseMap";
  import baseMapSel from "./sub/baseMapSel.vue";
  import baseMapRet from "./sub/baseMapRet.vue";

  //定义事件
  const emit = defineEmits(["okay", "closeForm"]);

  const props = defineProps({
    baseMap: {
      type: Object
    },
    baseArr: {
      type: Object
    }
  });

  const dg = ref({
    title: "基础字段映射",
    open: false,
    actTab: "tab1"
  });
  //值数据
  const _baseMap = ref({
    header: {
      consScene: "", //场景
      consFunc: "A", //功能类型
      consKey: "", //消费者
      consKeyName: "",
      consTable: "", //消费者数据表
      consTableName: "",
      consField: "", //消费者字段
      consFieldName: "",
      consFieldType: "", //数据类型
      consType: "", //消费方式 A1搜索帮助 A2下拉框
      consCheck: "", //检查类型
      consFrom: "", //取值字段
      servKey: "", //服务方
      servKeyName: "",
      sysCode: "" //应用系统
    },
    selList: [],
    retList: []
  });
  //消费方选择字段
  const _baseArr = computed(() => {
    return initBaseArr();
  });

  onMounted(() => {
    initData();
  });
  //初始化数据
  const initData = () => {
    //抬头赋值
    const header = props.baseMap.header;
    _baseMap.value.header.consScene = header.consScene; //场景
    _baseMap.value.header.consKey = header.consKey; //消费者
    _baseMap.value.header.consKeyName = header.consKeyName;
    if (header.consTable) _baseMap.value.header.consTable = header.consTable; //消费者数据表
    if (header.consTableName) _baseMap.value.header.consTableName = header.consTableName;
    _baseMap.value.header.consField = header.consField; //消费者字段
    _baseMap.value.header.consFieldName = header.consFieldName;
    _baseMap.value.header.consFieldType = header.consFieldType;
    _baseMap.value.header.consType = header.consType ? header.consType : "A1"; //消费方式 A1搜索帮助 A2下拉框
    _baseMap.value.header.servKey = header.servKey; //服务方
    _baseMap.value.header.servKeyName = header.servKeyName;
    //行项目赋值
    if (props.baseMap.selList) _baseMap.value.selList = _.cloneDeep(props.baseMap.selList);
    if (props.baseMap.retList) _baseMap.value.retList = _.cloneDeep(props.baseMap.retList);
    //查询服务字段信息
    if (_baseMap.value.header.consType === "A1" && _baseMap.value.header.servKey) {
      getBaseFieldInfo();
    } else {
      dg.value.open = true;
    }
  };
  //更改数据方式
  const handleChangeType = () => {
    _baseMap.value.header.servKey = "";
    _baseMap.value.selList = [];
    _baseMap.value.retList = [];
  };
  //基础字段更改
  const handleChangeServKey = () => {
    getBaseFieldInfo();
  };
  //查询基础字段
  const getBaseFieldInfo = () => {
    if (_baseMap.value.header.consType === "A2" || !_baseMap.value.header.servKey) {
      return;
    }
    let mapTemp = _.cloneDeep(_baseMap.value);
    _baseMap.value.selList = [];
    _baseMap.value.retList = [];
    getBaseField(_baseMap.value.header.servKey).then(res => {
      if (res.data) {
        //抬头赋值
        _baseMap.value.header.servKey = res.data.header.fieldCode;
        _baseMap.value.header.servKeyName = res.data.header.fieldName;
        //查询映射
        if (res.data.pcFilter.length > 0) {
          for (let i = 0; i < res.data.pcFilter.length; i++) {
            const item = res.data.pcFilter[i];
            //查找字段是否已使用
            const tmpSel = mapTemp.selList.find(r => r.servField === item.fieldId);
            //服务字段赋值
            _baseMap.value.selList.push({
              servField: item.fieldId,
              servFieldName: item.fieldId + "." + item.fieldName,
              consTable: tmpSel ? tmpSel.consTable : "",
              consField: tmpSel ? tmpSel.consField : "",
              servFix: tmpSel ? tmpSel.servFix : false,
              servDef: tmpSel ? tmpSel.servDef : ""
            });
          }
        }
        //结果映射
        if (res.data.pcOutput.length > 0) {
          for (let i = 0; i < res.data.pcOutput.length; i++) {
            const item = res.data.pcOutput[i];
            //查找字段是否已使用
            const tmpRet = mapTemp.retList.find(r => r.servField === item.fieldId);
            //服务字段赋值
            _baseMap.value.retList.push({
              servField: item.fieldId,
              servFieldName: item.fieldId + "." + item.fieldName,
              consField: tmpRet ? tmpRet.consField : ""
            });
          }
        }
      } else {
        $m("CORE_CLIENT.E053", [_baseMap.value.header.servKey, _baseMap.value.header.sysCode]); //基础字段维护错误 & 系统代码 &
      }
      dg.value.open = true;
    });
  };

  //重置数据
  const reSet = () => {
    _baseMap.value.header.consType = "A1";
    _baseMap.value.header.servKey = "";
    _baseMap.value.header.servKeyName = "";
    _baseMap.value.selList = []; //查询条件映射
    _baseMap.value.retList = []; //输出结果映射
  };

  //数据确定
  const okayForm = () => {
    //设置返回数据
    let res = {
      header: {
        consScene: _baseMap.value.header.consScene, //场景
        consFunc: "A", //功能类型
        consKey: _baseMap.value.header.consKey, //消费者
        consTable: _baseMap.value.header.consTable, //消费者数据表
        consField: _baseMap.value.header.consField, //消费者字段
        consType: _baseMap.value.header.consType, //消费方式
        consCheck: "", //检查类型
        consFrom: "", //取值字段
        servKey: _baseMap.value.header.servKey, //服务方
        sysCode: "" //应用系统
      },
      selList: [], //查询条件映射
      retList: [] //输出结果映射
    };
    //搜索帮助检查
    if (res.header.servKey && res.header.consType === "A1") {
      //检查查询条件映射关系
      for (let i = 0; i < _baseMap.value.selList.length; i++) {
        let item = _baseMap.value.selList[i];
        if (item.servFix || item.consField) {
          res.selList.push(item);
        }
      }
      //检查输出结果映射关系
      for (let i = 0; i < _baseMap.value.retList.length; i++) {
        let item = _baseMap.value.retList[i];
        if (item.consField) {
          const temp = res.retList.find(r => r.consField === item.consField);
          if (temp) {
            $m("CORE_CLIENT.E054", item.consField); //输出结果映射关系重复 &
            return;
          }
          res.retList.push(item);
        }
      }
      //检查是否存在当前字段映射
      const temp = res.retList.find(r => r.consField === res.header.consField);
      if (!temp) {
        $m("CORE_CLIENT.E055", res.header.consField); //输出结果未映射消费者字段 &
        return;
      }
    }
    emit("okay", res);
    dg.value.open = false;
  };

  const handleCloseForm = () => {
    dg.value.open = false;
  };

  //取消
  const handleClose = () => {
    emit("closeForm");
  };

  //初始化选择框
  const initBaseArr = () => {
    let _arr = { table: [], cols: {} };
    for (let i = 0; i < props.baseArr.table.length; i++) {
      const item = props.baseArr.table[i];
      _arr.table.push({ svalue: item.tableCode, sname: item.tableName });
      _arr.cols[item.tableCode] = [];
      for (let j = 0; j < props.baseArr.cols[item.tableCode].length; j++) {
        const col = props.baseArr.cols[item.tableCode][j];
        _arr.cols[item.tableCode].push({ svalue: col.fieldCode, sname: col.fieldName });
      }
    }
    return _arr;
  };
</script>
