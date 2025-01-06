<template>
  <div class="g-tabsWrap">
    <div :class="['g-t', classTop]" :style="{ height: topHeight + 'px' }">
      <slot name="top" />
    </div>
    <div :class="['g-b', classBottom]">
      <slot name="bottom" />
    </div>
  </div>
</template>
<script setup>
  import { defineProps, ref, watch } from "vue";
  import _ from "lodash";

  const props = defineProps({
    topHeight: {
      type: Number,
      default: 200
    },
    //上边Tabs对象名称
    top: {
      type: String,
      default: undefined
    },
    //下边边Tabs对象名称
    bottom: {
      type: String,
      default: undefined
    },
    //折叠默认的参数
    fold: {
      type: String,
      default: "fold"
    }
  });
  //定义事件
  const emit = defineEmits(["update:top", "update:bottom"]);
  //Top是否显示
  const classTop = ref("");
  const _topNoFold = ref("");
  //Bottom是否显示
  const classBottom = ref("active");
  const _bottomNoFold = ref("");

  //Top监听
  watch(
    () => props.top,
    val => {
      if (val === props.fold) {
        if (classTop.value !== "hide") {
          classTop.value = "hide";
          //如果Bottom也是隐藏，更改值
          if (classBottom.value === "hide" && _bottomNoFold && _bottomNoFold !== props.fold && _bottomNoFold !== "") {
            emit("update:bottom", _.cloneDeep(_bottomNoFold));
            classBottom.value = "active";
          }
        }
      } else {
        if (classTop.value === "hide") {
          classTop.value = "active";
        }
        //记录上次打开的Tab值
        _topNoFold.value = val;
      }
    },
    { immediate: true }
  );
  //Bottom监听
  watch(
    () => props.bottom,
    val => {
      if (val === props.fold) {
        if (classBottom.value !== "hide") {
          classBottom.value = "hide";
          //如果Top也是隐藏，更改值
          if ((classTop.value === "hide" || classTop.value === "") && _topNoFold && _topNoFold !== props.fold && _topNoFold !== "") {
            emit("update:top", _.cloneDeep(_topNoFold));
            classTop.value = "active";
          }
        }
      } else {
        if (classBottom.value === "hide") {
          classBottom.value = "active";
        }
        //记录上次打开的Tab值
        _bottomNoFold.value = val;
      }
    },
    { immediate: true }
  );
</script>

<style scoped lang="scss">
  .g-tabsWrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
  }

  .g-t,
  .g-b {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-tabs) {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      > .el-tabs__content {
        flex: 1;
        overflow: auto;

        > .el-tab-pane {
          height: 100%;
        }
      }
    }
  }

  .g-t {
    :deep(.el-tabs--border-card) {
      border-bottom: none;
    }

    &.active {
      flex: 1;
    }

    &.hide {
      height: 40px !important;
      overflow: hidden;
    }
  }

  .g-b {
    &.active {
      flex: 1;
    }

    &.hide {
      height: 40px !important;
      overflow: hidden;
    }
  }
</style>
