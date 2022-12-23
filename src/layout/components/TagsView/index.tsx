import { defineComponent, ref, computed, Fragment } from "vue";
import { ElIcon } from "element-plus";
import Scroll from "@/components/Scroll";
import { Close } from "@element-plus/icons-vue";
import { useTagsStore } from "@/stores";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "TagsView",
  setup() {
    const container = ref(null);
    const router = useRouter();
    const store = useTagsStore();
    const { tags } = storeToRefs(store);
    const tagsList = computed(() => tags.value);

    const onTap = (e: MouseEvent, tag: any) => {
      if (e.button === 0) {
        router.push(tag.value);
      }
    };

    const onDel = (e: MouseEvent) => {
      e.stopPropagation();

      const target = e.target as HTMLElement;
      const index = target.getAttribute("data-index");

      store.RemoveTage(parseInt(index || ""));

      toPath();
    };

    const toPath = () => {
      const active = tags.value.find((e) => e.active);
      if (!active) {
        const next = tags.value[tags.value.length - 1];
        router.push(next ? next.value : "/");
      }
    };

    return () => {
      return (
        <div class="flex px-3 relative" ref={container}>
          <Scroll class="my-2.5">
            {{
              default: () => (
                <Fragment>
                  {tagsList.value.map((tag, index) => {
                    return (
                      <div
                        class="inline-flex items-center justify-center cursor-pointer bg-white rounded text-xs h-8 px-2.5 mr-3"
                        onMousedown={(e) => onTap(e, tag)}
                      >
                        <span class={{ "text-blue-700": tag.active }}>{tag.label}</span>

                        {!!index && (
                          <div
                            class="p-0.5 hover:bg-slate-200 transition duration-150 ease-in-out flex items-center rounded ml-1.5"
                            data-index={index}
                            onMousedown={onDel}
                          >
                            <ElIcon size="12px" class="pointer-events-none">
                              <Close />
                            </ElIcon>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </Fragment>
              )
            }}
          </Scroll>
        </div>
      );
    };
  }
});
