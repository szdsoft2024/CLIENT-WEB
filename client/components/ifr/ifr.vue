<template>
  <div style="width: 100%; height: 100%; position: relative">
    <iframe v-if="isFrame" :src="iframeSrc" frameborder="0" style="width: 100%; height: 100%" scrolling="auto" />
    <div v-else :id="renderId" class="g-render" style="height: 100%" />
  </div>
</template>

<script setup>
  import { loadMicroApp } from "qiankun";
  import { getCurrentInstance, onMounted, ref, watch } from "vue";
  import { $m } from "../../common/utils/globalConfig";
  import szdRouter from "../../common/utils/goRouter";
  import szdStoreSession from "../../common/store/storeSession";
  import szdStoreLocal from "../../common/store/storeLocal";
  //系统代码
  const SYS_CODE = process.env.VUE_APP_SYS_CODE;
  const env = process.env.VUE_APP_SYS_ENV;

  const emits = defineEmits(["close"]);
  const { appContext } = getCurrentInstance();
  const props = defineProps({
    routerCode: {
      type: String,
      default: ""
    },
    params: {
      type: Object,
      default: () => ({})
    }
  });
  //是否iframe渲染
  const isFrame = ref(false);
  //iframe渲染地址
  const iframeSrc = ref("");
  //动态Id
  const renderId = ref("renderWrap");

  onMounted(() => {
    initRender();
  });
  watch(
    () => props.routerCode,
    () => {
      initRender();
    }
  );

  const initRender = () => {
    //获取路由对象
    const routerObj = szdRouter.getRouterObj(props.routerCode);
    isFrame.value = !routerObj.iframeVue;
    if (isFrame.value) {
      //获取地址,通过iframe加载
      iframeSrc.value = szdRouter.goNavPath(props.routerCode, props.params);
    } else {
      renderId.value = "renderWrap" + props.routerCode + Date.now();
      //动态加载
      if (routerObj.sysCodeWeb === SYS_CODE) {
        szdRouter.renderComp({
          context: appContext,
          routerCode: props.routerCode,
          params: props.params,
          renderId: renderId.value,
          callback: () => {
            emits("close");
          }
        });
      } else if (SYS_CODE === "CORE") {
        loadMicroComponent({
          name: routerObj.sysCodeWeb,
          container: "#" + renderId.value,
          props: { routerCode: props.routerCode, params: props.params }
        });
      } else {
        $m("CORE_CLIENT.E026", [routerObj.sysCodeWeb, props.routerCode]); //微应用 & 不支持挂载其它应用组件 &，仅主应用可以挂载微应用
        isFrame.value = true;
        iframeSrc.value = szdRouter.goNavPath(props.routerCode, props.params);
      }
    }
  };

  //乾坤-主应用挂载微应用
  const loadMicroComponent = ({ name, container, props }) => {
    const sysMicro = szdStoreSession.getCoreLogin().sysMicro;
    const key = name.toUpperCase();
    const app = sysMicro[key];
    let entry = app.sysWebIp;
    // 本地调用
    if (env === "development") {
      const devParam = szdStoreLocal.getDev();
      console.warn("调用本地qiankun-参数配置", devParam);
      if (devParam && devParam.devIp && devParam.devIp[app.sysCode] && devParam.devIp[app.sysCode].vuePort && devParam.devIp[app.sysCode].vueActive) {
        entry = "http://localhost:" + devParam.devIp[app.sysCode].vuePort;
        console.warn("调用本地qiankun应用系统-" + app.sysCode, entry);
      }
    }
    const micro = loadMicroApp({
      name: app.sysCode, //微应用的名称
      entry: entry, //微应用访问地址
      container: container, //微应用容器Id
      props: { szdMircoProps: props }
    });
    micro.mountPromise.catch(() => {
      $m("CORE_CLIENT.E027", [app.sysCode, entry, props.routerCode]); //微应用 & 加载失败,请检查服务 & 是否启动,路由 & 配置是否正确
    });
  };
</script>

<style scoped lang="scss">
  :deep(.el-dialog) {
    width: auto;
    height: auto;

    .el-dialog__header {
      padding: 0;
      margin-right: 0;
    }

    .el-dialog__body {
      padding: 0.8rem 1.4rem;
      display: flex;
      align-items: center;
      justify-content: center;

      > div {
        color: #000;
        font-size: 0.24rem;
        font-weight: 500;
      }
    }
  }

  :deep(.g-render) {
    > * {
      padding: 0 !important;
    }
  }

  :deep(.g-render > div[data-sandbox-cfg="true"]) {
    height: 100%;

    > div {
      height: 100%;
    }
  }
</style>
