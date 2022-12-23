import { App } from "vue";
import { mountRouter, loadRoutes } from "@/routers";
import { mountStore, useUserStore } from "@/stores";
import { loadGuards } from "@/routers/guards";
import { ElMessage } from "element-plus";
import storage from "@/utils/storage";

import "nprogress/nprogress.css";
import "virtual:svg-icons-register";
import "./styles/index.scss";

type Options = {
  app: App<Element>;
};

export async function bootstrap(options: Options) {
  const { app } = options;

  app.config.globalProperties.Message = (
    message: string,
    type: "info" | "success" | "error" | "warning" = "info",
    showClose = true
  ) => {
    ElMessage({
      type,
      message,
      showClose
    });
  };

  app.directive("loadmore", {
    mounted(el, binding) {
      const select_dom = el.querySelector(".el-select-dropdown__wrap");

      select_dom.addEventListener("scroll", function () {
        // @ts-ignore
        const height = this.scrollHeight - this.scrollTop - 10 <= this.clientHeight;
        if (height) binding.value();
      });
    }
  });

  mountStore(app);

  useUserStore().SetTheme(storage.get("theme"));

  const router = mountRouter(app);

  await loadRoutes();
  loadGuards(router);

  return { router };
}
