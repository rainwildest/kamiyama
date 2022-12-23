const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login"),
    meta: {
      title: "登录"
    }
  },
  // {
  //   path: "/401",
  //   name: "401",
  //   component: () => import("@/views/error/401.vue"),
  //   icon: "",
  //   meta: {
  //     title: "401"
  //   }
  // },
  {
    path: "/404",
    name: "404",
    component: () => import("@/pages/error/404"),
    meta: {
      title: "404"
    }
  }
];

export default routes;
