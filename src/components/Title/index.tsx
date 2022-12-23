import { defineComponent } from "vue";

export default defineComponent({
  name: "Title",
  props: {
    text: {
      type: String,
      default: ""
    },
    titleClass: {
      type: String,
      default: "text-base"
    }
  },
  setup(props) {
    return () => {
      return (
        <div class="flex items-center relative text-gray-1000">
          <div class="w-1 bg-blue-1200 absolute h-full left-0" />
          <span class={`${props.titleClass} font-bold pl-3`}>{props.text}</span>
        </div>
      );
    };
  }
});
