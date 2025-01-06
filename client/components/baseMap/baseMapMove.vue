<template>
  <!--  * C1 数据库  查询取值不限制 查询取值不限制 A-A B-A C-B/A-->
  <!--  * C2和C3 数据字典 查询取值限制本结构-->
  <!--  * C4 直接赋值 下对上，上对下，表头间相互赋值-->
  <!--  * C5 汇总赋值 上级汇总下级，表头或自己结构汇总-->
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
          baseField="CORE_SCP_MP_MOVE"
          :span="12"
          :descSpan="12"
          required
          first
          @change="handleChangeType" />
        <szd-select-form-item-col
          label="应用系统"
          v-model="_baseMap.header.sysCode"
          baseField="CORE_SYST"
          :span="12"
          :disabled="_baseMap.header.consType !== 'C1'"
          required
          first
          :descSpan="12"
          @change="handleChangeType" />
        <!-- C1 数据库  查询取值不限制-->
        <template v-if="_baseMap.header.consType === 'C1'">
          <szd-input-form-item-col
            label="服务方"
            v-model="_baseMap.header.servKey"
            :span="12"
            :descSpan="12"
            :desc="_baseMap.header.servKeyName"
            show-help
            :help="{
              a: 'CORE_TABLE',
              b: _baseMap.header,
              c: ['servKey-tableCode', 'servKeyName-tableName'],
              d: [['sysCode', _baseMap.header.sysCode]]
            }"
            @change="handleChangeServKey"
            required
            readonly />
        </template>
        <!-- C2和C3 数据字典 查询取值限制本结构 -->
        <template v-else-if="_baseMap.header.consType === 'C2' || _baseMap.header.consType === 'C3'">
          <szd-input-form-item-col
            label="服务方"
            v-model="_baseMap.header.servKey"
            :span="12"
            :descSpan="12"
            :desc="_baseMap.header.servKeyName"
            show-help
            :help="{ a: 'CORE_BASE', b: _baseMap.header, c: ['servKey-fieldCode', 'servKeyName-fieldName'], d: [['groupFlag', '2']] }"
            @change="handleChangeServKey"
            required
            readonly />
          <szd-select-form-item-col
            label="数据字典取值"
            v-model="_baseMap.header.consFrom"
            :span="12"
            :descSpan="12"
            :baseArr="_baseArr.cols[_baseMap.header.consTable]"
            clearable />
        </template>
        <!-- C4直接赋值和C5汇总赋值 -->
        <template v-else>
          <szd-input-form-item-col label="服务方" v-model="_baseMap.header.servKey" :span="12" :descSpan="12" disabled required readonly />
        </template>
      </el-row>
    </el-form>
    <!-- 页标签信息-基础字段数据维护 -->
    <template v-if="_baseMap.header.consType === 'C1'">
      <el-tabs v-model="dg.actTab">
        <!--   查询条件   -->
        <el-tab-pane :label="$t('查询条件映射')" name="tab1">
          <baseMapSel v-model:baseMap="_baseMap" :baseArr="_baseArr" />
        </el-tab-pane>
        <!--   输出结果   -->
        <el-tab-pane :label="$t('输出结果映射')" name="tab2">
          <baseMapRetC1 v-model:baseMap="_baseMap" :baseArr="_baseArr" />
        </el-tab-pane>
      </el-tabs>
    </template>
    <!-- C4 直接赋值 下对上，上对下，表头间相互赋值  存在顺序处理问题及死循环问题-->
    <div v-else-if="_baseMap.header.consType === 'C4'" class="hp100">
      <baseMapRetC4 v-model:baseMap="_baseMap" :baseArr="_baseArr" />
    </div>
    <!-- C5 汇总赋值 上级汇总下级，表头或自己结构汇总，存在顺序处理问题及死循环问题-->
    <div v-else-if="_baseMap.header.consType === 'C5'" class="hp100">
      <baseMapRetC5 v-model:baseMap="_baseMap" :baseArr="_baseArr" />
    </div>

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
  import { getTableColumnList } from "../api/baseMap";
  import baseMapSel from "./sub/baseMapSel.vue";
  import baseMapRetC1 from "./sub/baseMapRetC1.vue";
  import baseMapRetC4 from "./sub/baseMapRetC4.vue";
  import baseMapRetC5 from "./sub/baseMapRetC5.vue";
  import { initBaseArrC1, initBaseArrC2, initBaseArrC4, initBaseArrC5 } from "./baseMapMoveOpt";

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
    title: "映射赋值",
    open: false,
    actTab: "tab1"
  });
  //值数据
  const _baseMap = ref({
    header: {
      consScene: "", //场景
      consFunc: "C", //功能类型
      consKey: "", //消费者
      consKeyName: "",
      consTable: "", //消费者数据表
      consTableName: "",
      consField: "", //消费者字段
      consFieldName: "",
      consFieldType: "", //数据类型
      consType: "", //消费方式 C1数据库 C2数据字典-键值.描述 C3.数据字典-描述 C4.直接赋值 C5.汇总赋值
      consCheck: "", //检查类型
      consFrom: "", //取值字段(数据字典取值)
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
    _baseMap.value.header.consType = header.consType ? header.consType : "C1"; //消费方式
    _baseMap.value.header.consFrom = header.consFrom && ["C2", "C3"].includes(header.consType) ? header.consFrom : ""; //取值字段(数据字典取值)
    _baseMap.value.header.servKey = header.servKey; //服务方
    _baseMap.value.header.servKeyName = header.servKeyName;
    _baseMap.value.header.sysCode = ["C2", "C3"].includes(header.consType) || !header.sysCode ? "CORE" : header.sysCode; //应用系统
    //行项目赋值
    if (props.baseMap.selList) _baseMap.value.selList = _.cloneDeep(props.baseMap.selList);
    if (props.baseMap.retList) _baseMap.value.retList = _.cloneDeep(props.baseMap.retList);
    if (["C4", "C5"].includes(header.consType) && _baseMap.value.retList.length > 0) {
      _baseMap.value.retList.forEach(item => {
        item.servKey = Number(item.servKey);
      });
    }
    //查询服务字段信息
    if (_baseMap.value.header.consType === "C1" && _baseMap.value.header.sysCode && _baseMap.value.header.servKey) {
      getBaseFieldInfo();
    } else {
      dg.value.open = true;
    }
  };
  //更改数据方式
  const handleChangeType = () => {
    if (["C2", "C3"].includes(_baseMap.value.header.consType)) _baseMap.value.header.sysCode = "CORE";
    _baseMap.value.header.consFrom = "";
    _baseMap.value.header.servKey = ["C4", "C5"].includes(_baseMap.value.header.consType) ? _baseMap.value.header.consKey : "";
    _baseMap.value.selList = [];
    _baseMap.value.retList = [];
    initBaseArr();
  };
  //基础字段更改
  const handleChangeServKey = () => {
    getBaseFieldInfo();
  };
  //查询基础字段
  const getBaseFieldInfo = () => {
    if (_baseMap.value.header.consType !== "C1" || !_baseMap.value.header.sysCode || !_baseMap.value.header.servKey) {
      return;
    }
    let mapTemp = _.cloneDeep(_baseMap.value);
    _baseMap.value.selList = [];
    _baseMap.value.retList = [];
    getTableColumnList(_baseMap.value.header.sysCode, _baseMap.value.header.servKey).then(res => {
      if (res.data && res.data.length > 0) {
        //添加映射
        for (let i = 0; i < res.data.length; i++) {
          const item = res.data[i];
          //查询映射
          const tmpSel = mapTemp.selList.find(r => r.servField === item.columnName);
          _baseMap.value.selList.push({
            servField: item.columnName,
            servFieldName: item.columnName + "." + item.columnComment + (item.isPk === "0" ? "(PK)" : ""),
            consTable: tmpSel ? tmpSel.consTable : "",
            consField: tmpSel ? tmpSel.consField : "",
            servFix: tmpSel ? tmpSel.servFix : false,
            servDef: tmpSel ? tmpSel.servDef : ""
          });
          //结果映射
          const tmpRet = mapTemp.retList.find(r => r.servField === item.columnName);
          _baseMap.value.retList.push({
            servField: item.columnName,
            servFieldName: item.columnName + "." + item.columnComment + (item.isPk === "0" ? "(PK)" : ""),
            consField: tmpRet ? tmpRet.consField : "",
            consFieldPre: tmpRet ? tmpRet.consFieldPre : ""
          });
        }
      } else {
        $m("CORE_CLIENT.E056", [_baseMap.value.header.servKey, _baseMap.value.header.sysCode]); //服务方维护错误 & 系统代码 &
      }
      dg.value.open = true;
    });
  };

  //重置数据
  const reSet = () => {
    _baseMap.value.header.consType = "C1";
    _baseMap.value.header.servKey = "";
    _baseMap.value.header.servKeyName = "";
    _baseMap.value.header.sysCode = !props.baseMap.header.sysCode ? "CORE" : props.baseMap.header.sysCode;
    _baseMap.value.selList = []; //查询条件映射
    _baseMap.value.retList = []; //输出结果映射
    initBaseArr();
  };
  //数据确定
  const okayForm = () => {
    //设置返回数据
    let res = {
      header: {
        consScene: _baseMap.value.header.consScene, //场景
        consFunc: "C", //功能类型
        consKey: _baseMap.value.header.consKey, //消费者
        consTable: _baseMap.value.header.consTable, //消费者数据表
        consField: _baseMap.value.header.consField, //消费者字段
        consType: _baseMap.value.header.consType, //消费方式
        consCheck: "", //检查类型
        consFrom: ["C2", "C3"].includes(_baseMap.value.header.consType) ? _baseMap.value.header.consFrom : "", //取值字段(数据字典取值)
        servKey: ["C4", "C5"].includes(_baseMap.value.header.consType) ? _baseMap.value.header.consKey : _baseMap.value.header.servKey, //服务方
        sysCode: _baseMap.value.header.sysCode //应用系统
      },
      selList: [], //查询条件映射
      retList: [] //输出结果映射
    };
    //赋值及检查
    if (res.header.servKey) {
      if (res.header.consType === "C1") {
        //检查查询条件映射关系
        for (let i = 0; i < _baseMap.value.selList.length; i++) {
          let item = _baseMap.value.selList[i];
          if (item.servFix || item.consField) {
            res.selList.push(item);
          }
        }
        //检查查询结果不能为空
        if (res.selList.length === 0) {
          $m("CORE_CLIENT.E051"); //查询条件未映射
          return;
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
      } else if (["C2", "C3"].includes(res.header.consType)) {
        //数据字典
        if (!res.header.consFrom) {
          $m("CORE_CLIENT.E057"); //服务方为数据字典，数据字典取值不能为空
          return;
        }
      } else if (res.header.consType === "C4") {
        //直接赋值 //检查输出结果
        for (let i = 0; i < _baseMap.value.retList.length; i++) {
          let item = _baseMap.value.retList[i];
          //检查排序字段
          if (!item.consMovePos) {
            $m("CORE_CLIENT.E058"); //排序不能为空
            return;
          }
          const temp = res.retList.find(r => r.consMovePos === item.consMovePos);
          if (temp) {
            $m("CORE_CLIENT.E059"); //排序字段不能重复
            return;
          }
          if (item.servFix || item.consField) {
            res.retList.push(item);
          }
        }
        if (res.retList.length === 0) {
          $m("CORE_CLIENT.E060"); //直接赋值未维护映射
          return;
        }
      } else if (res.header.consType === "C5") {
        //汇总赋值 //检查输出结果
        for (let i = 0; i < _baseMap.value.retList.length; i++) {
          let item = _baseMap.value.retList[i];
          //检查排序字段
          if (!item.consMovePos) {
            $m("CORE_CLIENT.E058"); //排序不能为空
            return;
          }
          const temp = res.retList.find(r => r.consMovePos === item.consMovePos);
          if (temp) {
            $m("CORE_CLIENT.E059"); //排序字段不能重复
            return;
          }
          if (item.consOption && item.consField) {
            const tempField = res.retList.find(r => r.consTable === item.consTable && r.consField === item.consField);
            if (tempField) {
              $m("CORE_CLIENT.E061", [item.consTable, item.consField]); //表 & 字段 & 重复
              return;
            }
            res.retList.push(item);
          }
        }
        if (res.retList.length === 0) {
          $m("CORE_CLIENT.E062"); //汇总赋值未维护映射
          return;
        }
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

  //初始化数据
  const initBaseArr = () => {
    let _arr = { table: [], cols: {} };
    if (_baseMap.value.header.consType === "C1") {
      _arr = initBaseArrC1(props.baseArr);
    } else if (["C2", "C3"].includes(_baseMap.value.header.consType)) {
      _arr = initBaseArrC2(props.baseArr);
    } else if (_baseMap.value.header.consType === "C4") {
      _arr = initBaseArrC4(props.baseArr, _baseMap.value);
    } else if (_baseMap.value.header.consType === "C5") {
      _arr = initBaseArrC5(props.baseArr, _baseMap.value);
    }
    if (_arr.table.length === 0) {
      $m("CORE_CLIENT.E063"); //选择的消费类型数据结构不支持
      reSet();
    }
    return _arr;
  };
</script>
