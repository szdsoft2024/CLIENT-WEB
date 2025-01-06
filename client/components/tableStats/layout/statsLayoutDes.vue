<template>
  <!-- 数据过滤 -->
  <div class="app-sub-container j-drag">
    <el-row :gutter="15">
      <el-col :span="6">
        <div class="m-drag">
          <h3>{{ $t("字段选择") }}</h3>
          <div class="list drag-area-all">
            <template v-for="itemAll in _laySta.catsAll">
              <div :id="itemAll.field" class="drag-area-all-div">
                <el-icon>
                  <Rank />
                </el-icon>
                {{ itemAll.labelAndParent }}
              </div>
            </template>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <!-- 维度区域 -->
        <div class="m-drag" style="height: 55%">
          <h3>{{ $t("维度") }}</h3>
          <div class="list-table drag-area-dim">
            <el-table ref="refTable1" border stripe :data="_laySta.catsDim" row-key="field" class="flex-1">
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
              <el-table-column prop="$SZDPos" :label="$t('位置')" min-width="30" align="center" />
              <el-table-column prop="label" :label="$t('输出别名')" min-width="120">
                <template #default="scope">
                  <szd-input v-model="scope.row.label" />
                </template>
              </el-table-column>
              <el-table-column prop="order" :label="$t('排序/小计')" min-width="100" align="center">
                <template #default="scope">
                  <szd-select
                    v-model="scope.row.order"
                    :baseArr="[
                      { svalue: '1', sname: $t('升序') },
                      { svalue: '2', sname: $t('升序小计') },
                      { svalue: '3', sname: $t('降序') },
                      { svalue: '4', sname: $t('降序小计') }
                    ]"
                    clearable />
                </template>
              </el-table-column>
              <el-table-column prop="align" :label="$t('对齐方式')" min-width="100">
                <template #default="scope">
                  <szd-select
                    v-model="scope.row.align"
                    :baseArr="[
                      { svalue: 'left', sname: $t('左对齐') },
                      { svalue: 'center', sname: $t('居中') },
                      { svalue: 'right', sname: $t('右对齐') }
                    ]"
                    clearable />
                </template>
              </el-table-column>
              <el-table-column :label="$t('操作')" min-width="50" align="center">
                <template #default="scope">
                  <el-button type="primary" link icon="Delete" @click="handleDelCatsDim(scope.row)">
                    {{ $t("删除") }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 指标区域 -->
        <div class="m-drag" style="height: 45%">
          <h3>{{ $t("指标") }}</h3>
          <div class="list-table drag-area-tar">
            <el-table ref="refTable2" border stripe :data="_laySta.catsTar" row-key="$SZDId" class="flex-1">
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
              <el-table-column prop="$SZDPos" :label="$t('位置')" min-width="40" align="center" />
              <el-table-column prop="label" :label="$t('输出别名')" min-width="120">
                <template #default="scope">
                  <szd-input v-model="scope.row.label" />
                </template>
              </el-table-column>
              <el-table-column prop="order" :label="$t('排序')" min-width="80" align="center">
                <template #default="scope">
                  <szd-select
                    v-model="scope.row.order"
                    :baseArr="[
                      { svalue: '1', sname: $t('升序') },
                      { svalue: '3', sname: $t('降序') }
                    ]"
                    clearable />
                </template>
              </el-table-column>
              <el-table-column prop="doSum" :label="$t('指标规则')" min-width="80">
                <template #default="scope">
                  <szd-select
                    v-if="scope.row.type === 'number'"
                    v-model="scope.row.doSum"
                    :baseArr="[
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
                      { svalue: '3', sname: $t('最小值') },
                      { svalue: '4', sname: $t('最大值') },
                      { svalue: '5', sname: $t('统计行数') }
                    ]"
                    first />
                </template>
              </el-table-column>
              <el-table-column prop="align" :label="$t('对齐方式')" min-width="80">
                <template #default="scope">
                  <szd-select
                    v-model="scope.row.align"
                    :baseArr="[
                      { svalue: 'left', sname: $t('左对齐') },
                      { svalue: 'center', sname: $t('居中') },
                      { svalue: 'right', sname: $t('右对齐') }
                    ]"
                    clearable />
                </template>
              </el-table-column>
              <el-table-column :label="$t('操作')" min-width="50" align="center">
                <template #default="scope">
                  <el-button type="primary" link icon="Delete" @click="handleDelCatsTar(scope.row)">
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
  import "../css/stats.scss";
  import { computed, defineProps, onMounted } from "vue";
  import { $t } from "../../../common/utils/globalConfig";
  import Sortable from "sortablejs";
  import { handleOnEndAreaALL, handleOnEndAreaDim, handleOnEndAreaTar, setPos } from "../js/statsLayout";

  const props = defineProps({
    laySta: {
      type: Object
    }
  });
  //同步数据-过滤设置
  const _laySta = computed({
    get: () => props.laySta,
    set: val => {
      emit("update:laySta", val);
    }
  });
  //删除数据
  const handleDelCatsDim = cat => {
    _laySta.value.catsDim = _laySta.value.catsDim.filter(item => item !== cat);
    setPos(_laySta); //设置位置
  };
  //删除数据
  const handleDelCatsTar = cat => {
    _laySta.value.catsTar = _laySta.value.catsTar.filter(item => item !== cat);
    setPos(_laySta); //设置位置
  };

  //加载数据
  onMounted(() => {
    dragRow();
  });
  //行拖拽
  const dragRow = () => {
    const fieldAll = document.querySelector(".drag-area-all");
    const areaDim = document.querySelector(".drag-area-dim .el-scrollbar__wrap");
    const tbodyDim = document.querySelector(".drag-area-dim .el-table__body-wrapper tbody");
    const areaTar = document.querySelector(".drag-area-tar .el-scrollbar__wrap");
    const tbodyTar = document.querySelector(".drag-area-tar .el-table__body-wrapper tbody");
    //字段区域
    Sortable.create(fieldAll, {
      group: { name: "drag-area", pull: "clone", put: false },
      animation: 300,
      sort: false,
      onEnd: evt => {
        handleOnEndAreaALL(evt, _laySta);
      }
    });
    //整个表格区域
    Sortable.create(areaDim, {
      group: { name: "drag-tbody-dim", pull: false, put: ["drag-area"] },
      handle: ".main-drag-handle"
    });
    //表格tbody区域
    Sortable.create(tbodyDim, {
      group: { name: "drag-tbody-dim", pull: false, put: ["drag-area"] },
      animation: 300,
      draggable: ".el-table__row",
      handle: ".main-drag-handle",
      onEnd: evt => {
        handleOnEndAreaDim(evt, _laySta);
      }
    });
    //整个表格区域
    Sortable.create(areaTar, {
      group: { name: "drag-tbody-tar", pull: false, put: ["drag-area"] },
      handle: ".main-drag-handle"
    });
    //表格tbody区域
    Sortable.create(tbodyTar, {
      group: { name: "drag-tbody-tar", pull: false, put: ["drag-area"] },
      animation: 300,
      draggable: ".el-table__row",
      handle: ".main-drag-handle",
      onEnd: evt => {
        handleOnEndAreaTar(evt, _laySta);
      }
    });
  };
</script>
