// v-szd-dialog: 设置大小
const fullicon = require("./full.png");
const fulliconAct = require("./full-act.png");
const unfullicon = require("./unfull.png");
const unfulliconAct = require("./unfull-act.png");
export default {
  //渲染完毕
  mounted(el, binding, vnode) {
    const elDialog = el.parentNode.parentNode;
    //设置窗口大小
    const size = binding.value;
    // 判断是不是百分数
    const isWidthPercent = size[0].toString().includes("%");
    const isHeightPercent = size[1].toString().includes("%");
    if (elDialog) {
      elDialog.style.cssText = `--el-dialog-width: ${isWidthPercent ? size[0] : size[0] + "px"};
            height:${isHeightPercent ? size[1] : size[1] + "px"}`;
    }

    //计算弹窗最大层级
    if (elDialog && elDialog.parentNode && elDialog.parentNode.parentNode) {
      let zIndexMax = Number(elDialog.parentNode.parentNode.style.zIndex);
      const allLayers = document.querySelectorAll(".el-overlay");
      allLayers.forEach(item => {
        if (item.style.display !== "none") {
          if (zIndexMax < Number(item.style.zIndex)) zIndexMax = Number(item.style.zIndex);
        }
      });
      if (zIndexMax > Number(elDialog.parentNode.parentNode.style.zIndex)) {
        elDialog.parentNode.parentNode.style.zIndex = zIndexMax + 1;
      }
    }

    // 设置全屏
    function setFull() {
      let isFullScreen = false;
      if (!elDialog) {
        console.error("v-szd-dialog指令挂载失败，多数原因是组件传参错误如：v-model");
        return;
      }
      //记录原始样式
      let cssVal = elDialog.getAttribute("style");
      const elDialogHeader = elDialog.querySelector(".el-dialog__header");
      let img = null;
      const hasImg = elDialogHeader.querySelector(".img-full");
      const closeBth = elDialogHeader.querySelector(".el-dialog__headerbtn");

      if (hasImg) {
        img = hasImg;
      } else {
        img = document.createElement("img");
      }

      img.classList.add("img-full");
      img.src = fullicon;
      img.style.width = "16px";
      img.style.height = "14px";
      img.style.float = "right";
      img.style.cursor = "pointer";
      img.style.position = "absolute";
      img.style.top = "10px";
      img.style.right = "45px";
      if (!hasImg) {
        elDialogHeader.insertBefore(img, closeBth);
      }
      //鼠标移到图标
      img.onmouseover = function () {
        img.src = isFullScreen ? unfulliconAct : fulliconAct;
      };
      //鼠标移出图标
      img.onmouseout = function () {
        img.src = isFullScreen ? unfullicon : fullicon;
      };
      //点击图标
      img.onclick = function () {
        if (!isFullScreen) {
          isFullScreen = true;
          img.src = unfullicon;

          elDialog.classList.add("is-fullscreen");
          elDialog.style.cssText = "";
        } else {
          isFullScreen = false;
          img.src = fullicon;

          elDialog.classList.remove("is-fullscreen");
          elDialog.style.cssText = cssVal;
        }
      };
    }

    setFull();

    //拖拽窗口大小
    function dragSize() {
      if (!elDialog) {
        console.error("v-szd-dialog指令挂载失败，多数原因是组件传参错误如：v-model");
        return;
      }
      const topLeft = document.createElement("div");
      const topRight = document.createElement("div");
      const bottomLeft = document.createElement("div");
      const bottomRight = document.createElement("div");
      const mask = document.createElement("div");

      topLeft.className = "resizer top-left";
      topRight.className = "resizer top-right";
      bottomLeft.className = "resizer bottom-left u-bl";
      bottomRight.className = "resizer bottom-right u-br";

      const fixedStyle = "height:10px;width:10px;position:absolute;z-index:99;";
      topLeft.style.cssText = fixedStyle + "top:0;left:0;cursor: nwse-resize;";
      topRight.style.cssText = fixedStyle + "top:0;right:0;cursor: nesw-resize;";
      bottomLeft.style.cssText = fixedStyle + "bottom:0;left:0;cursor: nesw-resize;";
      bottomRight.style.cssText = fixedStyle + "bottom:0;right:0;cursor: nwse-resize;";
      mask.style.cssText = "position:absolute;left:0;top:0;right:0;bottom:0;z-index:22;background:transparent;display:none;";
      elDialog.appendChild(topLeft);
      elDialog.appendChild(topRight);
      elDialog.appendChild(bottomLeft);
      elDialog.appendChild(bottomRight);
      elDialog.appendChild(mask);
      const resizers = elDialog.querySelectorAll(".resizer");
      let original_width = 0;
      let original_height = 0;
      let original_x = 0;
      let original_y = 0;
      let original_mouse_x = 0;
      let original_mouse_y = 0;
      const minimum_size = 200;
      for (let i = 0; i < resizers.length; i++) {
        const currentResizer = resizers[i];
        currentResizer.addEventListener("mousedown", function (e) {
          mask.style.display = "block";
          original_width = parseFloat(getComputedStyle(elDialog, null).getPropertyValue("width").replace("px", ""));
          original_height = parseFloat(getComputedStyle(elDialog, null).getPropertyValue("height").replace("px", ""));
          original_x = elDialog.getBoundingClientRect().left;
          original_y = elDialog.getBoundingClientRect().top;
          original_mouse_x = e.pageX;
          original_mouse_y = e.pageY;

          document.addEventListener("mousemove", resize);
          document.addEventListener("mouseup", stopResize, true);
        });

        function resize(e) {
          if (currentResizer.classList.contains("bottom-right")) {
            const width = original_width + (e.pageX - original_mouse_x);
            const height = original_height + (e.pageY - original_mouse_y);
            if (width > minimum_size) {
              elDialog.style.width = width + "px";
            }
            if (height > minimum_size) {
              elDialog.style.height = height + "px";
            }
          } else if (currentResizer.classList.contains("bottom-left")) {
            const height = original_height + (e.pageY - original_mouse_y);
            const width = original_width - (e.pageX - original_mouse_x);
            if (height > minimum_size) {
              elDialog.style.height = height + "px";
            }
            if (width > minimum_size) {
              elDialog.style.width = width + "px";
            }
          } else if (currentResizer.classList.contains("top-right")) {
            const width = original_width + (e.pageX - original_mouse_x);
            const height = original_height - (e.pageY - original_mouse_y);
            if (width > minimum_size) {
              elDialog.style.width = width + "px";
            }
            if (height > minimum_size) {
              elDialog.style.height = height + "px";
            }
          } else {
            const width = original_width - (e.pageX - original_mouse_x);
            const height = original_height - (e.pageY - original_mouse_y);
            if (width > minimum_size) {
              elDialog.style.width = width + "px";
            }
            if (height > minimum_size) {
              elDialog.style.height = height + "px";
            }
          }
        }

        function stopResize() {
          mask.style.display = "none";
          document.removeEventListener("mousemove", resize);
          document.removeEventListener("mouseup", stopResize);
        }
      }
    }

    dragSize();
  }
};
