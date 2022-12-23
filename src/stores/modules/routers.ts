import { defineStore } from "pinia";
import storage from "@/utils/storage";
import dynamic from "@/routers/modules/dynamic";
import { mountDynamicRoutes } from "@/routers";
import { getToken } from "@/utils/auth";

export const useRoutersStore = defineStore("routers", {
  state: () => {
    return {
      views: getToken() ? storage.get("views") || [] : []
    };
  },

  actions: {
    SetViews(views: any) {
      this.views = views;
      storage.set("views", views);
    },

    GetViews() {
      const path: any[] = [];

      dynamic.forEach((item) => {
        if (item?.meta?.show === false) return;
        if (!item?.children) return path.push(item);

        if (item.children.length === 1 && !item?.meta?.showSubMenu) {
          const $children = item.children.filter((item) => item?.meta?.show !== false);
          path.push(...$children);
        } else {
          const $children = item.children.filter((item) => item?.meta?.show !== false);

          if ($children.length === 1 && !item?.meta?.showSubMenu) {
            path.push(...$children);
          } else {
            path.push({ ...item, children: $children });
          }
        }
      });

      this.SetViews(path);
      mountDynamicRoutes(dynamic || []);

      return dynamic;
    }
  }
});
