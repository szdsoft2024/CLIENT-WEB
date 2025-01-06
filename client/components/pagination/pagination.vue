<template>
  <!-- 通用分页组件 -->
  <div v-show="total > 0" class="pagination-container" :style="position === 'right' ? '' : { height: 'auto', padding: 0 }">
    <el-pagination
      v-model:current-page="_currentPage"
      v-model:page-size="_pageSize"
      :page-sizes="_pageSizes"
      :total="total"
      v-bind="$attrs"
      small
      :layout="layout"
      :background="background"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :class="position === 'right' ? 'pagination-container-right' : 'pagination-container-left'" />
  </div>
</template>

<script setup>
  import { defineProps, defineEmits, computed } from "vue";
  import szdStoreSession from "../../common/store/storeSession";

  const props = defineProps({
    //总条数
    total: {
      type: Number,
      default: 0
    },
    //当前第几页
    page: {
      type: Number,
      default: 1
    },
    //页大小
    limit: {
      type: Number,
      default: 20
    },
    //页范围
    pageSizes: {
      type: Array,
      default: []
    },
    //显示位置
    position: {
      type: String,
      default: "right"
    },
    //显示样式
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    //是否显示背景
    background: {
      type: Boolean,
      default: true
    }
  });
  //定义事件
  const emit = defineEmits(["update:page", "update:limit", "pagination"]);

  //当前第几页
  const _currentPage = computed({
    get: () => props.page,
    set: val => {
      emit("update:page", val);
    }
  });

  //页范围
  const _pageSizes = computed(() => {
    if (props.pageSizes && props.pageSizes.length > 0) {
      return props.pageSizes;
    } else {
      let _sizes = szdStoreSession.getWebParams("web_table_pagination", false);
      if (_sizes) {
        return _sizes;
      } else {
        return [20, 50, 200, 500];
      }
    }
  });

  //页大小
  const _pageSize = computed({
    get: () => props.limit,
    set: val => {
      emit("update:limit", val);
      emit("update:page", 1);
    }
  });

  //页大小改变
  const handleSizeChange = val => {
    emit("pagination", { page: _currentPage.value, limit: val });
    scrollTo();
  };

  //调整第几页
  const handleCurrentChange = val => {
    emit("pagination", { page: val, limit: _pageSize.value });
    scrollTo();
  };

  //滚到到头位置
  const scrollTo = () => {
    const els = document.querySelectorAll(".el-table__body-wrapper");
    if (els) {
      els.forEach(item => {
        item.scrollTop = 0;
      });
    }
  };
</script>
<style scoped>
  /* 分页 */
  .pagination-container {
    position: relative;
    height: 50px;
    padding: 10px;
    box-sizing: border-box;
  }

  .pagination-container .el-pagination {
    height: 30px;
    position: absolute;
  }

  .pagination-container-right {
    right: 0;
  }

  .pagination-container-left {
    left: 0;
  }
</style>
