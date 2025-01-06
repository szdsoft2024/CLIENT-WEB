<template>
  <!-- 业务主体信息-通过按钮点击，标签模式  -->
  <div class="main-button">
    <div class="main-button-right" style="width: 100%">
      <szd-button label="检查" type="primary" @click="emit('check')" :disabled="bussBase.delFlag" :szdopt="szdopt" />
      <szd-button label="保存" type="primary" @click="emit('submit')" :disabled="bussBase.delFlag" :szdopt="szdopt" />
      <szd-button label="删除" type="primary" @click="emit('delete')" :disabled="bussBase.delFlag || !bussBase.pkVal" :szdopt="szdopt" />
      <szd-button label="业务主体" type="primary" @click="handleBussBase" :disabled="!bussBase.pkVal" />
    </div>
    <scpBussBase ref="refScpBussBase" />
  </div>
</template>

<script setup>
  import { defineEmits, defineProps, ref } from "vue";
  import scpBussBase from "./scpBussBase.vue";

  //更新数据对象
  const emit = defineEmits(["check", "submit", "delete"]);

  //子屏幕
  const refScpBussBase = ref();

  const props = defineProps({
    //业务主体
    bussBase: {
      type: Object,
      default: {}
    },
    szdopt: {
      type: String
    }
  });

  //显示业务主体
  const handleBussBase = () => {
    refScpBussBase.value.acceptData(props.bussBase);
  };
</script>
