<template>
  <!-- 数据过滤 -->
  <div class="j-drag">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="m-drag">
          <h3>{{ $t("字段选择") }}</h3>
          <div class="list">
            <template v-for="itemAll in _filterObj.catsAll">
              <el-button v-if="itemAll.show" type="primary" link icon="CirclePlusFilled" @click="handleAddCats(itemAll)">
                {{ itemAll.labelAndParent }}
              </el-button>
            </template>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="m-drag">
          <h3>{{ $t("查询条件") }}</h3>
          <div class="list">
            <el-form class="app-el-form" v-if="_filterObj.catsSel.length > 0">
              <template v-for="itemSel in _filterObj.catsSel">
                <el-row>
                  <div class="div-but">
                    <el-button type="primary" icon="Remove" @click="handleDelCats(itemSel)" />
                  </div>
                  <div class="flex-1">
                    <szd-sch-form-item
                      v-model="_filterObj.fRanges[itemSel.field]"
                      :label="itemSel.labelAndParent"
                      :type="itemSel.type"
                      :numDot="itemSel.numDot"
                      :numDec="itemSel.numDec"
                      :help="itemSel.help"
                      :prop="itemSel.field" />
                  </div>
                </el-row>
              </template>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
  import "../css/table.scss";
  import { $t } from "../../../common/utils/globalConfig";
  import { computed, defineEmits, defineProps } from "vue";
  //回调事件
  const emit = defineEmits(["update:filterObj"]);
  const props = defineProps({
    filterObj: {
      type: Object
    }
  });
  //同步数据-过滤设置
  const _filterObj = computed({
    get: () => props.filterObj,
    set: val => {
      emit("update:filterObj", val);
    }
  });
  //添加查询条件
  const handleAddCats = itemAll => {
    itemAll.show = false;
    _filterObj.value.catsSel.push(itemAll);
    _filterObj.value.fRanges[itemAll.field] = [];
  };
  //删除查询条件
  const handleDelCats = itemSel => {
    itemSel.show = true;
    _filterObj.value.catsSel = _filterObj.value.catsSel.filter(item => item !== itemSel);
    _filterObj.value.fRanges[itemSel.field] = [];
    delete _filterObj.value.fRanges[itemSel.field];
  };
</script>
