import { ElLoading } from "element-plus";

const szdLoading = {
  loading: null,
  show: function (timeout) {
    this.loading = ElLoading.service({ lock: true, background: "transparent" });
    if (timeout > 0) {
      setTimeout(() => {
        if (this.loading) {
          this.loading.close();
        }
      }, timeout);
    }
  },
  close: function () {
    this.loading.close();
    this.loading = null;
  }
};

export default szdLoading;
