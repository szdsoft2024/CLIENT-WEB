<template>
  <!-- 排序规则 -->
  <div class="j-drag">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="m-drag">
          <h3>{{ $t("字段选择") }}</h3>
          <div class="list">
            <template v-for="cat in _sortObj.cats">
              <el-button v-if="cat.show" type="primary" link icon="CirclePlusFilled" @click="handleAddCats(cat)">
                {{ cat.labelAndParent }}
              </el-button>
            </template>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="m-drag">
          <h3>{{ $t("排序规则") }}</h3>
          <div class="list-table drag-area">
            <el-table ref="refTable1" border stripe :data="_sortObj.rule" row-key="field" class="flex-1">
              <el-table-column prop="labelAndParent" :label="$t('列名称(可拖动)')" min-width="150">
                <template #default="scope">
                  <div class="main-drag-handle">
                    <el-icon>
                      <Sort />
                    </el-icon>
                    {{ scope.row.labelAndParent }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="$SZDPos" :label="$t('优先级')" min-width="50" align="center" />
              <el-table-column prop="order" :label="$t('排序')" min-width="120" align="center">
                <template #default="scope">
                  <szd-radio
                    v-model="scope.row.order"
                    :baseArr="[
                      { svalue: 'ascending', sname: $t('升序') },
                      { svalue: 'descending', sname: $t('降序') }
                    ]" />
                </template>
              </el-table-column>
              <el-table-column :label="$t('操作')" min-width="60" align="center">
                <template #default="scope">
                  <el-button type="primary" link icon="Delete" @click="handleDelCats(scope.row)">
                    {{ $t("删除") }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
  import "../css/table.scss";
  import { $t } from "../../../common/utils/globalConfig";
  import { computed, defineEmits, defineProps, onMounted } from "vue";
  import Sortable from "sortablejs";
  //回调事件
  const emit = defineEmits(["update:sortObj"]);
  const props = defineProps({
    sortObj: {
      type: Object
    }
  });
  //同步数据-排序设置
  const _sortObj = computed({
    get: () => props.sortObj,
    set: val => {
      emit("update:sortObj", val);
    }
  });
  //添加字段
  const handleAddCats = cat => {
    cat.show = false;
    _sortObj.value.rule.push({
      field: cat.field,
      labelAndParent: cat.labelAndParent,
      order: "ascending",
      $SZDPos: 0
    });
    //设置位置
    setPos();
  };
  //删除字段
  const handleDelCats = cat => {
    //设置目录显示
    _sortObj.value.cats.find(item => item.field === cat.field).show = true;
    //删除数据
    _sortObj.value.rule = _sortObj.value.rule.filter(item => item !== cat);
    //设置位置
    setPos();
  };
  //设置位置
  const setPos = () => {
    _sortObj.value.rule.forEach((item, index) => {
      item.$SZDPos = index + 1;
    });
  };
  //加载数据
  onMounted(() => {
    dragRow();
  });
  //行拖拽
  const dragRow = () => {
    const tbody = document.querySelector(".m-drag .drag-area .el-table__body-wrapper tbody");
    Sortable.create(tbody, {
      animation: 300,
      draggable: ".el-table__row",
      handle: ".main-drag-handle",
      onEnd: ({ newIndex, oldIndex }) => {
        if (newIndex !== oldIndex) {
          const movedItem = _sortObj.value.rule.splice(oldIndex, 1)[0];
          _sortObj.value.rule.splice(newIndex, 0, movedItem);
          setPos(); //设置位置
        }
      }
    });
  };
</script>
