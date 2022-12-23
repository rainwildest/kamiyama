import { defineComponent, Fragment } from "vue";
import { ElMenuItem, ElSubMenu } from "element-plus";
import MenuItem from "./";
import IconSvg from "@/components/IconSvg";

export default defineComponent({
  name: "MenuItem",
  props: {
    item: Object
  },
  setup(props) {
    return () => {
      return (
        <Fragment>
          {!!(!props.item?.children || !props.item?.children?.length) && (
            <ElMenuItem index={props.item?.path}>
              <div class="w-24 flex items-center">
                {!!props.item?.meta?.icon && <IconSvg name={props.item?.meta.icon} class="w-6 h-6 flex-shrink-0" />}
                <span class="text-lg pl-2.5">{props.item?.meta?.title}</span>
              </div>
            </ElMenuItem>
          )}

          {!!(props.item?.children && props.item?.children?.length) && (
            <ElSubMenu
              index={props.item?.path}
              v-slots={{
                title: () => (
                  <div class="w-24 flex items-center">
                    {!!props.item?.meta?.icon && (
                      // <ElIcon class="pointer-events-none text-3xl">
                      <IconSvg name={props.item?.meta.icon} class="w-6 h-6 flex-shrink-0" />
                      // </ElIcon>
                    )}
                    <span class="text-lg pl-2.5">{props.item?.meta?.title}</span>
                  </div>
                )
              }}
            >
              {props.item?.children.map((child: any) => (
                <MenuItem item={child} />
              ))}
            </ElSubMenu>
          )}
        </Fragment>
      );
    };
  }
});
