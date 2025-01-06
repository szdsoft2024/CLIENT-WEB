<template>
  <!-- 显示的列 -->
  <div class="szd__tb__wrapper j-drag-area">
    <!-- 表格输出 -->
    <el-table ref="refTable1" border stripe :data="_colCat" row-key="$SZDId" default-expand-all class="flex-1">
      <el-table-column prop="label" :label="$t('列名称(可拖动)')" min-width="150">
        <template #default="scope">
          <div class="main-drag-handle">
            <el-icon>
              <Sort />
            </el-icon>
            {{ scope.row.label }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="$SZDPos" :label="$t('位置')" min-width="60" align="center" />
      <el-table-column prop="hide" :label="$t('隐藏')" min-width="80" align="center">
        <template #default="scope">
          <el-checkbox v-model="scope.row.hide" />
        </template>
      </el-table-column>
      <el-table-column v-if="props.lay.layout.showSummary" prop="doSum" :label="$t('合计规则')" min-width="100">
        <template #default="scope">
          <template v-if="!scope.row.children">
            <szd-select
              v-if="scope.row.type === 'number'"
              v-model="scope.row.doSum"
              :baseArr="[
                { svalue: '0', sname: $t('不汇总') },
                { svalue: '1', sname: $t('合计') },
                { svalue: '2', sname: $t('平均值') },
                { svalue: '3', sname: $t('最小值') },
                { svalue: '4', sname: $t('最大值') },
                { svalue: '5', sname: $t('统计行数') }
              ]"
              first />
            <szd-select
              v-else
              v-model="scope.row.doSum"
              :baseArr="[
                { svalue: '0', sname: $t('不汇总') },
                { svalue: '3', sname: $t('最小值') },
                { svalue: '4', sname: $t('最大值') },
                { svalue: '5', sname: $t('统计行数') }
              ]"
              first />
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="fixed" :label="$t('固定')" min-width="100">
        <template #default="scope">
          <template v-if="!scope.row.children && !scope.row.$SZDParent">
            <szd-select
              v-model="scope.row.fixed"
              :baseArr="[
                { svalue: 'left', sname: $t('固定左侧') },
                { svalue: 'right', sname: $t('固定右侧') }
              ]"
              clearable />
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="align" :label="$t('对齐方式')" min-width="100">
        <template #default="scope">
          <template v-if="!scope.row.children">
            <szd-select
              v-model="scope.row.align"
              :baseArr="[
                { svalue: 'left', sname: $t('左对齐') },
                { svalue: 'center', sname: $t('居中') },
                { svalue: 'right', sname: $t('右对齐') }
              ]"
              clearable />
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="field" :label="$t('列代码')" min-width="100" />
    </el-table>
  </div>
</template>

<script setup>
  import { defineProps, computed, onMounted, ref, defineEmits } from "vue";
  import { $m, $t } from "../../../common/utils/globalConfig";
  import Sortable from "sortablejs";
  import { setColCatPos } from "../js/tableLayout";
  //回调事件
  const emit = defineEmits(["update:colCat"]);
  const props = defineProps({
    lay: {
      type: Object,
      default: {}
    },
    colCat: {
      type: Array
    }
  });
  //同步数据-列设置
  const _colCat = computed({
    get: () => props.colCat,
    set: val => {
      emit("update:colCat", val);
    }
  });
  //
  const refTable1 = ref();
  //加载数据
  onMounted(() => {
    dragRow();
  });
  //行拖拽
  const dragRow = () => {
    const tbody = document.querySelector(".j-drag-area .el-table__body-wrapper tbody");
    Sortable.create(tbody, {
      animation: 300,
      draggable: ".el-table__row",
      handle: ".main-drag-handle",
      onMove: evt => {
        /*给每层数据添加level 或者查询每层数据的level，不同层级禁止挪动*/
        const dragLevel = evt.dragged.className.includes("level-") ? evt.dragged.className.split("level-")[1] : 0;
        const relatedLevel = evt.related.className.includes("level-") ? evt.related.className.split("level-")[1] : 0;
        if (parseInt(dragLevel) !== parseInt(relatedLevel)) {
          return false;
        }
      },
      onEnd: evt => {
        if (evt.newIndex !== evt.oldIndex) {
          //树形-查找当前节点在哪一层级
          const colChg = getPosBt(_colCat.value, evt.oldIndex + 1);
          //树形-查找更换到的坐标
          const nIndex = colChg.findIndex(item => item.$SZDPos === evt.newIndex + 1);
          if (nIndex < 0) {
            $m("CORE_CLIENT.E049"); //请在同级别进行拖动排序
            //复原拖拽之前的DOM
            const tagName = evt.item.tagName;
            const items = evt.from.getElementsByTagName(tagName);
            if (evt.oldIndex > evt.newIndex) {
              evt.from.insertBefore(evt.item, items[evt.oldIndex + 1]);
            } else {
              evt.from.insertBefore(evt.item, items[evt.oldIndex]);
            }
          } else {
            //树形-实现方法
            const oIndex = colChg.findIndex(item => item.$SZDPos === evt.oldIndex + 1);
            const movedItem = colChg.splice(oIndex, 1)[0];
            //设置id发生变化
            if (movedItem.children) {
              movedItem.$SZDId = movedItem.$SZDId + "$1";
            }
            colChg.splice(nIndex, 0, movedItem);
            //设置位置
            setColCatPos(_colCat);
          }
        }
      }
    });
  };
  const getPosBt = (pColCat, oldIndex) => {
    for (let i = 0; i < pColCat.length; i++) {
      if (pColCat[i].$SZDPos === oldIndex) {
        return pColCat;
      } else {
        if (pColCat[i].children) {
          let temp = getPosBt(pColCat[i].children, oldIndex);
          if (temp) {
            return temp;
          }
        }
      }
    }
  };
</script>
