import { defineStore } from "pinia";
import storage from "@/utils/storage";

export const useConfigStore = defineStore("config", {
  state: () => {
    return {
      collapse: storage.get("collapse") || false,
      layout: "layout-normal",

      // all these properties will have their type inferred automatically
      config: []
    };
  },
  actions: {
    SetCollapse(status: boolean) {
      this.collapse = status;
      storage.set("collapse", status);
    },

    modifyConfig(e: any) {
      this.config = e;
    }
  }
});
