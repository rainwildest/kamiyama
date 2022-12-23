import { defineComponent, KeepAlive, Transition, computed } from "vue";
import { useTagsStore, useConfigStore } from "@/stores";
import { storeToRefs } from "pinia";
import { ElContainer, ElMain } from "element-plus";
// import { useRoute } from "vue-router";
import Sider from "../Sider";
import Topbar from "../Topbar";
import TagsView from "../TagsView";

export default defineComponent({
  name: "LayoutNormal",
  props: {
    layout: {
      type: String,
      default: "layout-normal"
    }
  },
  setup() {
    // const route = useRoute();
    const configStore = useConfigStore();
    const tagStore = useTagsStore();
    const { tags } = storeToRefs(tagStore);
    const { collapse } = storeToRefs(configStore);

    // const key = computed(() => route.path);
    const caches = computed(() => [...tags.value.filter((e) => e.keepAlive).map((e) => e.name)]);

    return () => {
      return (
        <div class="w-full h-full flex">
          <ElContainer>
            <Sider collapse={collapse.value}></Sider>
            <ElContainer class="flex-col">
              <div class="fixed-header bg-gray-200">
                <Topbar />
                <TagsView />
              </div>
              <ElMain>
                <div class="main__view">
                  <router-view>
                    {{
                      default: ({ Component }: any) => (
                        <Transition mode="out-in" name="fade-transform">
                          {{
                            default: () => <KeepAlive include={caches.value}>{Component}</KeepAlive>
                          }}
                        </Transition>
                      )
                    }}
                  </router-view>
                </div>
              </ElMain>
            </ElContainer>
          </ElContainer>
        </div>
      );
    };
  }
});
