import { defineStore } from "pinia";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { login, signOut } from "@/apis";
import storage from "@/utils/storage";
import { tokenFlag } from "@/utils/config";
import { setTheme } from "@/utils";

type LoginParam = {
  data: Object;
  fail?: (data: any) => void;
  success?: (data: any) => void;
};

type SignOutParam = {
  fail?: (data: any) => void;
  success?: () => void;
};

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      token: getToken() || "",
      theme: storage.get("theme") || "light",
      isDark: storage.get("theme") === "dark",
      userinfo: storage.get("userinfo") || {}
    };
  },

  actions: {
    SetUserInfo(val: any) {
      this.userinfo = val;
      storage.set("userinfo", val);
    },

    SetToken(token: string) {
      this.token = token;
      setToken(token);
    },

    ClearToken() {
      removeToken();
      storage.clear();
    },

    /**
     * @brief 登录
     * @param {LoginParam} param
     * @returns void
     */
    Login(param: LoginParam) {
      login(param.data)
        .then(({ data }: any) => {
          tokenFlag.TokenInvalidFlag = 0;

          this.SetToken(`Bearer ${data.token}`);
          this.SetUserInfo(data);

          param?.success && param.success(data);
        })
        .catch((e: any) => {
          param?.fail && param.fail(e);
        });
    },

    SignOut(param: SignOutParam) {
      signOut()
        .then(() => {
          this.ClearToken();
          param?.success && param.success();
        })
        .catch((e: any) => {
          param?.fail && param.fail(e);
        });
    },

    SetTheme(type: "light" | "dark") {
      this.theme = type;
      this.isDark = type === "dark";

      storage.set("theme", type || "light");

      setTheme();
    }
  }
});
