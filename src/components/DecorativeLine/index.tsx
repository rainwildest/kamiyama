import { defineComponent } from "vue";
import IconSvg from "../IconSvg";

export default defineComponent({
  name: "DecorativeLine",
  setup() {
    return () => {
      return (
        <div class="absolute left-0 w-full flex items-end bottom-0 pl-32">
          <IconSvg name="card-header-line" class="h-1.5 w-33 absolute left-0" />
          <div class="card-header-line w-full h-px scale-y-50 ml-2" />
        </div>
      );
    };
  }
});
