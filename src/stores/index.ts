import { createPinia } from "pinia";
import { App } from "vue";

export { useUserStore } from "./modules/user";
export { useConfigStore } from "./modules/config";
export { useRoutersStore } from "./modules/routers";
export { useTagsStore } from "./modules/tags-view";

const store = createPinia();

export default store;

export function mountStore(app: App<Element>) {
  app.use(store);

  return store;
}
