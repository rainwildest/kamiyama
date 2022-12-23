import { defineComponent } from "vue";
import { ElHeader } from "element-plus";
import IconSvg from "@/components/IconSvg";
import { useConfigStore } from "@/stores";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "Topbar",
  setup() {
    const store = useConfigStore();
    const { collapse } = storeToRefs(store);

    const setCollapse = () => {
      store.SetCollapse(!collapse.value);
    };

    return () => {
      return (
        <ElHeader class="h-12 px-2 bg-white">
          <div class="h-full inline-flex items-center " onClick={setCollapse}>
            {collapse.value && <IconSvg class="!h-6 !w-6" name="indent" />}
            {!collapse.value && <IconSvg class="!h-6 !w-6" name="outdent" />}
          </div>
        </ElHeader>
      );
    };
  }
});
