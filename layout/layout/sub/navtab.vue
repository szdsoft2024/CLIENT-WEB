<template>
  <div id="tags-view-container" class="tags-view-container">
    <div class="tags-view-wrapper" @scroll="handleScroll" ref="refScrollWrapper">
      <router-link
        v-for="tag in visitedViews"
        ref="refTag"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        :class="isActive(tag) ? 'active' : ''"
        :style="activeStyle(tag)"
        @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent.native="openMenu(tag, $event)">
        <el-icon v-if="tag.title === '首页'" :class="{ 'el-icon-s-home': tag.title === '首页' }">
          <HomeFilled />
        </el-icon>
        <span v-else> {{ tag.title }} </span>
        <el-icon v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)">
          <Close />
        </el-icon>
      </router-link>
    </div>

    <ul v-show="tagMenu.visible" :style="{ left: tagMenu.left + 'px', top: tagMenu.top + 'px' }" class="contextmenu">
      <!-- <li @click="refreshSelectedTag(selectedTag)">刷新页面</li> -->
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭当前</li>
      <li @click="closeOthersTags(selectedTag)">关闭其他</li>
      <li v-if="!isAffix(selectedTag)" @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script setup>
  import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from "vue";
  import router from "@/router";
  import path from "path";
  import store from "~store";
  import { useRoute } from "vue-router";

  const { proxy } = getCurrentInstance();

  // ref控件
  const refTag = ref();
  const refScrollWrapper = ref();
  // 获取当前路由信息
  const currentRoute = useRoute();
  //用户登录信息
  const loginUser = ref(store.state.loginUser);
  //tag菜单
  const tagMenu = ref({ visible: false, top: 0, left: 0 });
  //固定标签
  const affixTags = ref([]);
  //右键选中的标签
  const selectedTag = ref({});
  //主题颜色
  const theme = ref(store.state.frameLayout.theme);
  //缓存页签
  const visitedViews = computed(() => {
    return store.state.frameTag.visitedViews;
  });

  onMounted(() => {
    initTags();
    addTags();
  });

  //监听路由变化
  watch(
    () => currentRoute.path,
    () => {
      addTags();
      moveToCurrentTag();
    },
    { deep: true }
  );

  //监听菜单变化
  watch(
    () => tagMenu.value.visible,
    () => {
      if (tagMenu.value.visible) {
        document.body.addEventListener("click", closeMenu);
      } else {
        document.body.removeEventListener("click", closeMenu);
      }
    }
  );

  //是否激活的页签
  const isActive = tag => {
    return tag.path === currentRoute.path;
  };
  //激活页签背景颜色和字体颜色
  const activeStyle = tag => {
    return isActive(tag) ? { "background-color": theme.value, "border-color": theme.value } : {};
  };
  //是否固定值标签
  const isAffix = tag => {
    return tag.meta && tag.meta.affix;
  };

  //添加标签
  const addTags = () => {
    const obj = { ...currentRoute };
    store.dispatch("frameTag/addView", obj);
  };

  //刷新标签
  const refreshSelectedTag = view => {
    store.dispatch("frameTag/delCachedView", view).then(() => {
      const { fullPath } = view;
      nextTick(() => {
        router.replace({ path: fullPath });
      });
    });
  };

  //关闭标签
  const closeSelectedTag = tag => {
    store.dispatch("frameTag/delView", tag).then(res => {
      if (isActive(tag)) toLastView();
    });
  };

  //关闭其它标签
  const closeOthersTags = tag => {
    router.push(tag.fullPath);
    store.dispatch("frameTag/delOthersViews", tag).then(() => {
      moveToCurrentTag();
    });
  };

  //关闭所有标签
  const closeAllTags = tag => {
    store.dispatch("frameTag/delAllViews").then(res => {
      //是否需要移动到最后一个
      if (!affixTags.value.some(r => r.path === tag.path)) {
        toLastView();
      }
    });
  };

  //移动到最后
  const toLastView = () => {
    const _view = visitedViews.value.slice(-1)[0];
    if (_view) {
      router.push(_view.fullPath);
    } else {
      router.push("/");
    }
  };

  //初始化固定标签
  const initTags = () => {
    affixTags.value = filterAffixTags(router.getRoutes());
    for (const tag of affixTags.value) {
      if (tag.name) store.dispatch("frameTag/addVisitedView", tag);
    }
  };

  //递归固定标签
  const filterAffixTags = (routeArr, basePath = "/") => {
    let tags = [];
    routeArr.forEach(route => {
      if (route.meta && route.meta.affix) {
        const tagPath = path.resolve(basePath, route.path);
        tags.push({
          fullPath: tagPath,
          path: tagPath,
          name: route.name,
          meta: { ...route.meta }
        });
      }
      if (route.children) {
        const tempTags = filterAffixTags(route.children, route.path);
        if (tempTags.length >= 1) {
          tags = [...tags, ...tempTags];
        }
      }
    });
    return tags;
  };

  //显示当前标签
  const moveToCurrentTag = () => {
    nextTick(() => {
      for (const tag of refTag.value) {
        if (tag.to.path === currentRoute.path) {
          moveToTarget(tag);
          //全路径不同时刷新路由信息
          if (tag.to.fullPath !== currentRoute.fullPath) {
            const obj = { ...currentRoute };
            store.dispatch("frameTag/updateVisitedView", obj);
          }
          break;
        }
      }
    });
  };

  //移动到选中标签
  const moveToTarget = currentTag => {
    const $container = refScrollWrapper.value;
    const $containerWidth = $container.offsetWidth;
    const $scrollWrapper = $container;
    const tagList = refTag.value;

    let firstTag = null;
    let lastTag = null;

    // find first tag and last tag
    if (tagList.length > 0) {
      firstTag = tagList[0];
      lastTag = tagList[tagList.length - 1];
    }

    if (firstTag === currentTag) {
      $scrollWrapper.scrollLeft = 0;
    } else if (lastTag === currentTag) {
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth;
    } else {
      // find preTag and nextTag
      const currentIndex = tagList.findIndex(item => item === currentTag);
      const prevTag = tagList[currentIndex - 1];
      const nextTag = tagList[currentIndex + 1];

      // the tag's offsetLeft after of nextTag
      const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth;

      // the tag's offsetLeft before of prevTag
      const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft;

      if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
        $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth;
      } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
        $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
      }
    }
  };

  //页标签右键菜单
  const openMenu = (tag, e) => {
    const menuMinWidth = 105;
    const offsetLeft = proxy.$el.getBoundingClientRect().left; // container margin left
    const offsetWidth = proxy.$el.offsetWidth; // container width
    const maxLeft = offsetWidth - menuMinWidth; // left boundary
    const left = e.clientX - offsetLeft + 15; // 15: margin right

    tagMenu.value.left = left > maxLeft ? maxLeft : left;
    tagMenu.value.top = e.clientY;
    tagMenu.value.visible = true;
    selectedTag.value = tag;
  };
  const closeMenu = () => {
    tagMenu.value.visible = false;
  };
  const handleScroll = () => {
    if (tagMenu.value.visible) closeMenu();
  };
</script>

<style lang="scss" scoped>
  .tags-view-container {
    height: 34px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

    .tags-view-wrapper {
      display: flex;
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      flex-wrap: nowrap;

      &::-webkit-scrollbar {
        height: 5px;
      }

      .tags-view-item {
        flex-shrink: 0;
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        padding: 0 8px;
        font-size: $fz;
        margin-left: 5px;
        margin-top: 4px;

        &:first-of-type {
          margin-left: 15px;
        }

        &:last-of-type {
          margin-right: 15px;
        }

        &.active {
          background-color: #42b983;
          color: #fff;
          border-color: #42b983;
        }
      }
    }

    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 3000;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: $fz;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;

        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>

<style lang="scss">
  //reset element css of el-icon-close
  .tags-view-wrapper {
    .tags-view-item {
      /*border-radius: 5px;*/
      padding: 0 10px !important;

      .el-icon-close {
        width: 16px;
        height: 16px;
        vertical-align: center;
        border-radius: 50%;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: 100% 50%;

        &:before {
          transform: scale(0.6);
          display: inline-block;
          vertical-align: center;
          line-height: 16px;
          text-align: center;
          width: 16px;
          height: 16px;
        }

        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }

    .el-scrollbar__bar {
      opacity: 1 !important;

      .el-scrollbar__thumb {
        background: #bbb !important;
      }
    }
  }
</style>
