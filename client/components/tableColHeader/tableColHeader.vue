<template>
  <!-- 列表头设置 -->
  <span class="h-title">
    <span v-if="required" class="main-required">*</span>{{ lang ? $t(label) : label }}
    <el-icon v-if="helpTip" class="main-help-tip">
      <QuestionFilled @click.prevent.stop="handleHelpTip" />
    </el-icon>
  </span>
</template>
<script setup>
  import szdTool from "../../common/tools/tool";
  import { $t } from "../../common/utils/globalConfig";

  const props = defineProps({
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ""
    },
    helpTip: {
      type: String
    },
    lang: {
      type: Boolean,
      default: true
    }
  });
  //显示文字帮助事件
  const handleHelpTip = () => {
    szdTool.helpDoc(props.helpTip);
  };
</script>

<style lang="scss" scoped>
  .h-title {
    display: inline-flex;
    overflow: hidden;
    align-items: center;
  }
</style>
