<template>
  <!-- 管理布局 -->
  <el-dialog
    title="保存变式"
    v-model="dg.open"
    append-to-body
    @close="handleClose"
    class="app-dialog-container"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[800, 500]" />
    <el-form class="app-el-form">
      <el-row>
        <szd-input-form-item-col :span="12" v-model="varObj.variant" :label="$t('变式代码')" :maxLenth="50" required />
        <szd-input-form-item-col :span="12" v-model="varObj.varName" :label="$t('变式名称')" :maxLenth="100" required />
      </el-row>
      <el-row>
        <szd-radio-form-item-col
          :span="12"
          v-model="varObj.varMode"
          label="可用范围"
          :baseArr="[
            { svalue: 'A', sname: $t('所有人可用') },
            { svalue: 'U', sname: $t('仅自己可用') }
          ]"
          required
          :disabled="props._lay.layout.varMode !== 'A'" />
      </el-row>
    </el-form>

    <!-- 表格输出 -->
    <el-table ref="refTable1" border stripe :data="varRule" class="flex-1" style="margin-top: 5px">
      <el-table-column prop="label" :label="$t('查询条件')" min-width="180" />
      <el-table-column prop="noVal" :label="$t('不设置变式')" min-width="100" align="center">
        <template v-slot="scope">
          <szd-checkbox v-model="scope.row.noVal" />
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <szd-button label="保存" type="primary" @click="handleSava" />
      <szd-button label="取消" type="primary" @click="handleClose" />
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, defineEmits, defineExpose, defineProps, ref } from "vue";
  import { $m, $t } from "../../../common/utils/globalConfig";

  //回调事件
  const emit = defineEmits(["layout-var"]);
  const props = defineProps({
    _lay: {
      type: Object
    }
  });
  //窗口对象
  const dg = ref({
    open: false
  });
  //排序规则
  const varObj = ref({
    variant: "", //变式代码
    varName: "", //变式名称
    varMode: "U", //变式级别
    varDefault: false //默认变式
  });
  //条件字段
  const varRule = computed(() => {
    let rule = [];
    //设置选择的数据
    for (let i = 0; i < props._lay.schCat.length; i++) {
      const item = props._lay.schCat[i];
      rule.push({
        field: item.field,
        label: item.label,
        noVal: false
      });
    }
    return rule;
  });

  //初始化数据
  const callInitData = row => {
    if (row.variant) {
      //设置变式代码和名称
      varObj.value.variant = row.variant;
      varObj.value.varName = row.varName;
      if (row.userId === props._lay.layout.$SZDUserId && row.varMode === "A") {
        varObj.value.varMode = row.varMode;
      }
      varObj.value.varDefault = false;
      //获取配置信息{rule列目录 val值}
      const varLay = JSON.parse(row.varJson);
      if (varLay.rule && Array.isArray(varLay.rule)) {
        for (let i = 0; i < varRule.value.length; i++) {
          const temp = varLay.rule.find(item => item.field === varRule.value[i].field);
          if (temp) {
            varRule.value[i].noVal = temp.noVal;
          }
        }
      }
    }
    //打开窗口
    dg.value.open = true;
  };

  const handleSava = () => {
    if (!varObj.value.variant || !varObj.value.varName) {
      $m("CORE_CLIENT.E046"); //变式代码和变式名称不能为空
      return;
    }
    //回调
    emit("layout-var", varObj.value, varRule.value);
    handleClose();
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
