<template>
  <template v-if="!_ctrl.hide || _ctrl.notAuth">
    <template v-if="_ctrl.tip">
      <el-tooltip effect="light" :content="_ctrl.tip" placement="top-start">
        <szd-button
          :type="_ctrl.type"
          :label="_ctrl.label"
          :text="_ctrl.text"
          :link="_ctrl.link"
          :disabled="_ctrl.disabled"
          :notAuth="_ctrl.notAuth"
          :icon="_ctrl.icon"
          :color="_ctrl.color"
          :szdfst="_ctrl.szdfst"
          :szdopt="_ctrl.szdopt"
          @click="handleClick(_ctrl.fCode)" />
      </el-tooltip>
    </template>
    <template v-else>
      <szd-button
        :type="_ctrl.type"
        :label="_ctrl.label"
        :text="_ctrl.text"
        :link="_ctrl.link"
        :disabled="_ctrl.disabled"
        :notAuth="_ctrl.notAuth"
        :icon="_ctrl.icon"
        :color="_ctrl.color"
        :szdfst="_ctrl.szdfst"
        :szdopt="_ctrl.szdopt"
        @click="handleClick(_ctrl.fCode)" />
    </template>
  </template>
</template>

<script setup>
  import { defineProps, defineEmits, computed } from "vue";

  const props = defineProps({
    //控件参数
    ctrl: {
      type: Object
    }
  });
  const emit = defineEmits(["click"]);
  //控件参数
  const _ctrl = computed(() => {
    let ctrl = {
      fCode: props.ctrl.fCode, //功能码
      label: props.ctrl.label, //名称
      tip: props.ctrl.tip, //提示信息
      type: props.ctrl.type, //按钮类型 同Element
      text: props.ctrl.text, //是否为文字按钮
      link: props.ctrl.link, //是否为链接按钮
      disabled: props.ctrl.disabled, //是否可用
      notAuth: props.ctrl.notAuth, //无权限
      icon: props.ctrl.icon, //图标
      color: props.ctrl.color, //按钮颜色
      hide: props.ctrl.hide || ["4", "5"].includes(props.ctrl.szdfst), //隐藏
      szdfst: props.ctrl.szdfst, //字段状态
      szdopt: props.ctrl.szdopt //显示状态
    };
    return ctrl;
  });
  //点击事件
  const handleClick = fCode => {
    emit("click", fCode);
  };
</script>
