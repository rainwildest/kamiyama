import NProgress from "nprogress";
import { Router, RouteLocationNormalized } from "vue-router";
import { checkToken } from "@/utils/auth";
import { useTagsStore } from "@/stores";

NProgress.configure({ showSpinner: false });

const loginIgnore = {
  names: ["404", "401"], //根据路由名称匹配
  paths: ["/login"], //根据路由fullPath匹配

  // 判断路由是否包含在该配置中
  includes(route: RouteLocationNormalized) {
    return this.names.includes(route.name as string) || this.paths.includes(route.path);
  }
};

export function loadGuards(router: Router) {
  router.beforeEach(async (to, from: any, next: any) => {
    if (!NProgress.isStarted()) NProgress.start();

    if (checkToken()) {
      // 拥有 token 时
      if (to.name === "login") {
        next({ path: "/" });
        NProgress.done();
      } else {
        const hasRoute = router.hasRoute(to.name || "");
        if (hasRoute) {
          const store = useTagsStore();

          if (!to.meta.ignore) {
            store.AddTages({
              keepAlive: to.meta.keepAlive,
              label: to.meta.title,
              value: to.fullPath,
              name: to.name
            });
          }

          next();
        } else {
          next({ ...to, replace: true });
        }
      }
    } else {
      /* 没 token 时逻辑处理 */
      if (!loginIgnore.includes(to)) {
        next({ path: "/login", replace: true });
        NProgress.done();
      } else {
        next();
      }
    }
  });

  router.afterEach(() => {
    NProgress.done();
  });
}
