import { defineStore } from "pinia";

export const useTagsStore = defineStore("tags", {
  state: () => {
    return {
      tags: [
        {
          label: "首页",
          value: "/",
          keepAlive: true,
          active: true,
          name: "layout"
        }
      ]
    };
  },
  actions: {
    AddTages(item: any) {
      const index = this.tags.findIndex((e) => e.value.split("?")[0] === item.value.split("?")[0]);
      this.tags.map((e) => (e.active = e.value === item.value));

      if (item.value === "/") {
        item.label = "首页";
        item.name = "layout";
        item.value = "/";
        item.keepAlive = false;
        item.active = true;
      }

      if (index < 0) {
        if (item.label) this.tags.push({ ...item, active: true });
      } else {
        this.tags[index].active = true;
        this.tags[index].keepAlive = item.keepAlive || false;
        this.tags[index].label = item.label;
        this.tags[index].value = item.value;
        this.tags[index].name = item.name;
      }
    },
    RemoveTage(index: number) {
      this.tags.splice(index, 1);
    }
  }
});
