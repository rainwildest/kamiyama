import { defineComponent } from "vue";
import Menu from "./Menu";

export default defineComponent({
  name: "Sider",
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots }) {
    return () => {
      return (
        <div class="sider-container pt-9">
          {slots.default ? slots.default() : ""}
          <div class="menu">
            <Menu collapse={props.collapse} />
          </div>
        </div>
      );
    };
  }
});
