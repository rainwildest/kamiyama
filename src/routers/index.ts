import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { App } from "vue";
import routes from "./modules/pages";
import dynamic from "./modules/dynamic";
import { useRoutersStore } from "@/stores";
import { getToken } from "@/utils/auth";

// import
export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  strict: true
});

/**
 * @brief 挂载路由
 * @param {App<Element>} app
 * @returns Router
 */
export const mountRouter = (app: App<Element>) => {
  app.use(router);

  return router;
};

/**
 * @brief 加载路由
 * @returns void
 */
export async function loadRoutes() {
  const store = useRoutersStore();
  const views = store.views;

  views.length && getToken() && mountDynamicRoutes(dynamic);
}

/**
 * @brief 动态添加路由
 * @param {Array<RouteRecordRaw>} routers
 * @returns void
 */
export function mountDynamicRoutes(routers: RouteRecordRaw[]) {
  routers.forEach((item) => router.addRoute({ ...item }));

  // 在动态路由添加后，在将404添加进入，解决刷新是找不到路由跳转404
  router.addRoute({
    path: "/:pathMatch(.*)",
    redirect: "/404"
  });
}
