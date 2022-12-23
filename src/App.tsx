import { defineComponent, ref } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

export default defineComponent({
  name: "App",
  setup: () => {
    return () => (
      <ElConfigProvider locale={zhCn}>
        <router-view />
      </ElConfigProvider>
    );
  }
});
