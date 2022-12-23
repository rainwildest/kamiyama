import { RouteRecordRaw } from "vue-router";
import Layout from "@/layout";

export const dynamic: RouteRecordRaw[] = [
  {
    path: "/",
    name: "layout",
    component: Layout,
    meta: {
      title: "首页",
      icon: "home-01",
      affix: false,
      keepAlive: true,
      showSubMenu: true
    },
    children: [
      {
        path: "/",
        component: () => import("@/pages/home"),
        name: "home",
        meta: {
          title: "数据大屏",
          affix: false,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/detection",
    component: Layout,
    meta: {
      title: "站点检测",
      icon: "site-detection",
      affix: false,
      keepAlive: true
    },
    children: [
      {
        path: "/weighing-data",
        component: () => import("@/pages/weighing/datum"),
        name: "weighing-data",
        meta: {
          title: "称重数据",
          affix: false
        }
      },
      {
        path: "/weighing-details",
        component: () => import("@/pages/weighing/datum-details"),
        name: "weighing-details",
        meta: {
          title: "称重数据详情",
          affix: false,
          show: false
        }
      },
      {
        path: "/electric-fence",
        component: () => import("@/pages/weighing/fences"),
        name: "electric-fence",
        meta: {
          title: "电子围栏",
          affix: false,
          keepAlive: true
        }
      },
      {
        path: "/fence-details",
        component: () => import("@/pages/weighing/fences-details"),
        name: "fence-details",
        meta: {
          title: "电子围栏详情",
          affix: false,
          show: false
        }
      }
    ]
  },

  {
    path: "/enterprise",
    component: Layout,
    meta: {
      title: "源头企业",
      icon: "enterprise",
      showSubMenu: true
    },
    children: [
      {
        path: "/corporate-information",
        component: () => import("@/pages/corporate/info"),
        name: "corporate-information",
        meta: {
          title: "企业信息",
          affix: false,
          keepAlive: true
        }
      }
      // {
      //   path: "/new-business",
      //   component: () => import("@/pages/corporate/info"),
      //   name: "new-business",
      //   meta: {
      //     title: "新增企业",
      //     affix: false,
      //     keepAlive: true
      //   }
      // }
    ]
  },
  {
    path: "/site",
    component: Layout,
    meta: {
      title: "源头站点",
      icon: "source-site",
      showSubMenu: true
    },
    children: [
      {
        path: "/site-query",
        component: () => import("@/pages/site/index"),
        name: "SiteQuery",
        meta: {
          title: "站点查询",
          affix: false,
          keepAlive: true
        }
      },
      {
        path: "/edit-site",
        component: () => import("@/pages/site/modify"),
        name: "edit-site",
        meta: {
          title: "编辑站点",
          affix: false,
          show: false
        }
      }
    ]
  },

  {
    path: "/system",
    component: Layout,
    meta: {
      title: "系统设置",
      icon: "setting",
      showSubMenu: true
    },
    children: [
      {
        path: "/system-user",
        component: () => import("@/pages/system/users"),
        name: "system-user",
        meta: {
          title: "系统用户",
          affix: false,
          keepAlive: true
        }
      }
    ]
  }
];

export default dynamic;
