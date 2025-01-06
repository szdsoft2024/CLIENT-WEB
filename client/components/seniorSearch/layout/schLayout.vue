<template>
  <!-- 变式管理 -->
  <el-dialog
    title="变式管理"
    v-model="dg.open"
    append-to-body
    @close="handleClose"
    class="app-dialog-container"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[860, 560]" />

    <!-- 表格输出 -->
    <el-table ref="refTable1" border stripe :data="layList" class="flex-1">
      <el-table-column prop="variant" :label="$t('变式代码')" min-width="100">
        <template v-slot="scope">
          <el-button type="primary" link @click="handleRowSel(scope.row)">{{ scope.row.variant }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="varName" :label="$t('变式名称')" min-width="180" />
      <el-table-column prop="varMode" :label="$t('变式级别')" min-width="100" align="center">
        <template v-slot="scope">
          <span v-if="scope.row.varMode === 'A'">{{ $t("所有人可用") }}</span>
          <span v-else>{{ $t("仅自己可用") }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" :label="$t('创建人')" min-width="100" />
      <el-table-column :label="$t('操作')" align="center" width="150" fixed="right">
        <template v-slot="scope">
          <el-button type="primary" link icon="Finished" @click="handleRowSel(scope.row)">{{ $t("选择") }}</el-button>
          <template v-if="scope.row.auth">
            <el-button type="primary" link icon="Delete" @click="handleRowDel(scope.row)">{{ $t("删除") }}</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!--  footer区域 -->
    <template #footer>
      <el-button type="primary" @click="handleSavaVar"> {{ $t("创建变式") }}</el-button>
      <el-button type="primary" @click="handleClose"> {{ $t("关闭") }}</el-button>
    </template>
    <!-- 保存变式 -->
    <schLayoutVar ref="refSchLayoutVar" :_lay="_lay" @layout-var="handleLayoutVar" />
  </el-dialog>
</template>

<script setup>
  import { computed, defineEmits, defineExpose, defineProps, nextTick, ref } from "vue";
  import _ from "lodash";
  import { $m, $t } from "../../../common/utils/globalConfig";
  import { getVarList, saveVariant, delVariant } from "../../api/seniorSearch";
  import schLayoutVar from "./schLayoutVar.vue";

  //回调事件
  const emit = defineEmits(["update:lay"]);
  const props = defineProps({
    //高级搜索数据
    modelValue: {
      type: Object,
      required: true,
      default: {}
    },
    //高级搜索字段
    lay: {
      type: Object
    }
  });
  //子屏幕ref
  const refSchLayoutVar = ref(); //保存变式
  //窗口对象
  const dg = ref({
    open: false
  });
  //同步更改的参数-布局
  const _lay = computed({
    get: () => props.lay,
    set: val => {
      emit("update:lay", val);
    }
  });
  //同步更改的参数-布局
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });
  //获取后端数据
  const layList = ref([]);

  //初始化数据
  const callInitData = () => {
    getLayList();
  };

  //获取管理布局清单
  const getLayList = () => {
    layList.value = [];
    getVarList(_lay.value.layout.report).then(res => {
      if (res.code === 200) {
        layList.value = res.data;
      }
      if (!dg.value.open && (!layList.value || layList.value.length === 0)) {
        dg.value.open = true;
        nextTick(() => {
          handleSavaVar();
        });
      } else {
        dg.value.open = true;
      }
    });
  };

  //选择布局
  const handleRowSel = row => {
    if (!row.varJson) return;
    //设置变式代码和名称
    _lay.value.layout.$SZDVar = {
      variant: row.variant ? row.variant : "",
      varName: row.varName ? row.varName : "",
      varMode: row.varMode ? row.varMode : "",
      varDefault: row.varDefault,
      userId: row.userId ? row.userId : ""
    };
    //获取配置信息{rule列目录 val值}
    const varLay = JSON.parse(row.varJson);
    //设置选择的数据
    for (let i = 0; i < _lay.value.schCat.length; i++) {
      const item = _lay.value.schCat[i];
      //查找规则
      const l_rule = varLay.rule.find(ru => ru.field === item.field);
      if (l_rule && !l_rule.noVal) {
        if (varLay.val[item.field]) {
          _modelValue.value[item.field] = _.cloneDeep(varLay.val[item.field]);
        } else {
          _modelValue.value[item.field] = [];
        }
      }
    }
    handleClose();
  };

  //布局保存窗口打开
  const handleSavaVar = () => {
    let row = {};
    if (_lay.value.layout.$SZDVar.variant && layList.value && layList.value.length > 0) {
      row = layList.value.find(r => r.variant === _lay.value.layout.$SZDVar.variant);
      if (!row) row = {};
    }
    refSchLayoutVar.value.callInitData(row);
  };
  //保存和应用布局
  const handleLayoutVar = (varObj, varRule) => {
    //设置变式代码和名称
    _lay.value.layout.$SZDVar = {
      variant: varObj.variant ? varObj.variant : "",
      varName: varObj.varName ? varObj.varName : "",
      varMode: varObj.varMode ? varObj.varMode : "",
      varDefault: varObj.varDefault,
      userId: _lay.value.layout.$SZDUserId
    };
    //保存数据到数据库
    savaLayoutData(varObj, varRule);
    handleClose();
  };
  //保存布局
  const savaLayoutData = (varObj, varRule) => {
    let json = {
      report: _lay.value.layout.report,
      variant: varObj.variant, //变式代码
      varName: varObj.varName, //变式名称
      varMode: varObj.varMode, //变式级别
      varDefault: varObj.varDefault, //默认变式
      //仅存配置信息-不存其它数据
      varJson: JSON.stringify({
        rule: varRule,
        val: _modelValue.value
      })
    };
    //保存数据
    saveVariant(json).then(res => {
      if (res.code === 200) {
        $m("CORE_CLIENT.S001"); //保存成功
        handleClose();
      }
    });
  };

  //删除布局
  const handleRowDel = row => {
    let json = {
      report: row.report,
      variant: row.variant, //变式代码
      varMode: row.varMode //变式级别
    };
    delVariant(json).then(res => {
      if (res.code === 200) {
        $m("CORE_CLIENT.S003"); //删除成功
        getLayList();
      }
    });
  };

  //关闭窗口
  const handleClose = () => {
    dg.value.open = false;
  };

  //定义父组件可以调用方法
  defineExpose({
    callInitData
  });
</script>
