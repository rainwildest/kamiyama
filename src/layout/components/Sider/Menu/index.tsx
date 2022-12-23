import { defineComponent, computed } from "vue";
import { storeToRefs } from "pinia";
import { ElAside, ElMenu } from "element-plus";
import { useRoutersStore } from "@/stores";
import MenuItem from "../MenuItem";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Menu",
  props: {
    collapse: {
      type: Boolean
    }
  },
  setup(props) {
    const { currentRoute } = useRouter();
    const store = useRoutersStore();
    const { views } = storeToRefs(store);

    const activedPath = computed(() => {
      const { path } = currentRoute.value;

      return path;
    });

    const routeList = computed(() => (views.value && views.value.length > 0 ? views.value : []));

    return () => {
      return (
        <ElAside class="w-full">
          <ElMenu router uniqueOpened class="sider-menu" collapse={props.collapse} defaultActive={activedPath.value}>
            {routeList.value.map((route: any) => (
              <MenuItem key={route.path} item={route} />
            ))}
          </ElMenu>
        </ElAside>
      );
    };
  }
});
