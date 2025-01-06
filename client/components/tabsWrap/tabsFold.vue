<template>
  <div class="g-tabsFold" :style="_fold ? { height: props.height + 'px' } : ''">
    <!-- 按钮区域 -->
    <div class="div-fold" @click="handleFold()" :style="_fold ? { borderBottom: 'none' } : ''">
      <el-icon>
        <ArrowDown v-if="_fold" />
        <ArrowRight v-else />
      </el-icon>
      {{ $t(label) }}
    </div>
    <!-- 插槽区域 -->
    <div v-show="_fold" class="div-slot flex-1 ova" :style="border ? { border: '1px solid #d8dce6' } : ''">
      <slot />
    </div>
  </div>
</template>
<script setup>
  import { defineEmits, defineProps, ref, watch } from "vue";
  import { $t } from "../../common/utils/globalConfig";

  const emit = defineEmits(["update:fold", "change"]);
  const props = defineProps({
    fold: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: ""
    },
    border: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number
    }
  });
  //是否打开
  const _fold = ref(true);
  watch(
    () => props.fold,
    () => {
      _fold.value = props.fold;
    },
    { immediate: true }
  );
  //折叠设置
  const handleFold = () => {
    _fold.value = !_fold.value;

    emit("change", _fold.value);
  };
</script>

<style scoped lang="scss">
  .g-tabsFold {
    display: flex;
    flex-direction: column;
    width: 100%;

    .div-fold {
      display: flex;
      align-items: center;
      width: 100%;
      height: 30px;
      border: 1px solid #d8dce6;
      padding: 0 5px;
      cursor: pointer;
      background: #f7f9fa;
      font-size: $fz;

      > .el-icon {
        margin-right: 5px;
        line-height: 1.1em;
      }

      &:hover {
        color: #a0cfff;
      }
    }

    .div-slot {
      width: 100%;
      padding: 2px;
    }
  }
</style>
