<template>
  <el-button v-if="!_fst.hide" :type="type" :text="text" :link="link" :disabled="_fst.disabled" :icon="icon" :color="color" @click="emit('click')">
    {{ $t(label) }}
  </el-button>
</template>

<script setup>
  import { defineProps, defineEmits, computed } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    //按钮类型 同Element
    type: {
      type: String,
      default: "primary"
    },
    label: {
      type: String,
      default: ""
    },
    text: {
      type: Boolean
    },
    link: {
      type: Boolean
    },
    disabled: {
      type: Boolean,
      default: false
    },
    noAuth: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String
    },
    color: {
      type: String
    },
    szdfst: {
      type: String
    },
    szdopt: {
      type: String
    }
  });
  //事件
  const emit = defineEmits(["click"]);
  //编辑状态
  const _fst = computed(() => {
    if (props.noAuth) {
      return { readonly: false, disabled: false, hide: false };
    } else {
      return szdComp.getCompFst(props.szdfst, props.szdopt, props.disabled);
    }
  });
</script>
