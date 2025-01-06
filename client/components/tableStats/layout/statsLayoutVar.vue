<template>
  <!-- 管理布局 -->
  <el-dialog
    :title="$t('保存布局')"
    v-model="dg.open"
    append-to-body
    @close="handleClose"
    class="app-dialog-container"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[500, 300]" />
    <el-form class="app-el-form">
      <el-row>
        <szd-input-form-item-col :span="24" v-model="varObj.variant" :label="$t('变式代码')" :maxLenth="50" required />
      </el-row>
      <el-row>
        <szd-input-form-item-col :span="24" v-model="varObj.varName" :label="$t('变式名称')" :maxLenth="100" required />
      </el-row>
      <el-row>
        <szd-radio-form-item-col
          :span="24"
          v-model="varObj.varMode"
          label="可用范围"
          :baseArr="[
            { svalue: 'A', sname: $t('所有人可用') },
            { svalue: 'U', sname: $t('仅自己可用') }
          ]"
          :disabled="props.lay.layout.varMode !== 'A'" />
      </el-row>
      <el-row>
        <szd-checkbox v-model="varObj.varDefault" boxLabel="默认变式" />
      </el-row>
    </el-form>
    <template #footer>
      <szd-button label="保存" type="primary" @click="handleSava" />
      <szd-button label="取消" type="primary" @click="handleClose" />
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineEmits, defineExpose, defineProps, ref } from "vue";
  import { $m, $t } from "../../../common/utils/globalConfig";

  //回调事件
  const emit = defineEmits(["layout-var"]);
  const props = defineProps({
    lay: {
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

  //初始化数据
  const callInitData = () => {
    //设置变式代码和名称
    varObj.value.variant = props.lay.layout.$SZDVar.variant;
    varObj.value.varName = props.lay.layout.$SZDVar.varName;
    if (props.lay.layout.$SZDVar.userId === props.lay.layout.$SZDUserId && props.lay.layout.varMode === "A") {
      varObj.value.varMode = props.lay.layout.$SZDVar.varMode;
    }
    varObj.value.varDefault = props.lay.layout.$SZDVar.varDefault ? props.lay.layout.$SZDVar.varDefault : false;
    //打开窗口
    dg.value.open = true;
  };

  const handleSava = () => {
    if (!varObj.value.variant || !varObj.value.varName) {
      $m("CORE_CLIENT.E046"); //变式代码和变式名称不能为空
      return;
    }
    //回调
    emit("layout-var", varObj.value);
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
