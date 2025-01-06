import frameLayout from "../client/common/store/storeVuexFrameLayout.js";
import frameTag from "../client/common/store/storeVuexFrameTag.js";
import loginUser from "../client/common/store/storeVuexLoginUser";
import vuexData from "../client/common/store/storeVuexData";

const storeModules = {
  loginUser,
  frameTag,
  frameLayout,
  vuexData
};

export default storeModules;
