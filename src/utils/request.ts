import axios from "axios";
// import QS from "qs";
import { ElMessageBox, ElMessage } from "element-plus";
// import NetworkConfig from "../config/http.config";
import { getToken } from "./auth";
import { useUserStore } from "@/stores";
import { tokenFlag } from "./config";

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 10000
});

service.interceptors.request.use(
  (config) => {
    if (useUserStore().token && !!config?.headers) {
      config.headers["Authorization"] = getToken() || "";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;

    if (res.code !== 200) {
      if (res.code !== 401) {
        if (hasError()) return;

        ElMessage({
          message: res.message || "Error",
          type: "error",
          duration: 5 * 1000
        });
      }

      if (res.code === 401 && tokenFlag.TokenInvalidFlag === 0) {
        ElMessageBox.confirm("登录已失效，您可以取消停留在本页，或再次登录，确认注销", {
          confirmButtonText: "登录",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          useUserStore().ClearToken();

          location.reload();
        });

        tokenFlag.TokenInvalidFlag = 1;
      }

      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    // console.log("err" + error);
    if (hasError()) return;

    ElMessage({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

const hasError = () => {
  if (tokenFlag.SucessRequstCode !== 0) return true;
  tokenFlag.SucessRequstCode = 1;

  setTimeout(() => {
    tokenFlag.SucessRequstCode = 0;
  }, 1000 * 5);

  return false;
};
export default service;
