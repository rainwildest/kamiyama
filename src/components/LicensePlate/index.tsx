import { defineComponent, watch, ref, toRefs, onMounted, Fragment } from "vue";

export default defineComponent({
  name: "LicensePlate",
  props: {
    text: {
      type: String,
      required: true,
      default: ""
    },
    code: {
      type: Number || null,
      default: null
    }
  },
  setup(props) {
    const isAuto = ref(true);
    const label = ref("");
    const className = ref("");
    const header = ref("");
    const footer = ref("");

    const { text, code } = toRefs(props);

    watch(text, () => {
      onInit();
    });

    onMounted(() => {
      onInit();
    });

    const onInit = () => {
      code.value || code.value === 0 ? onCodeInit() : onAutoInit();
    };

    const onCodeInit = () => {
      // 0其它，11黄牌，21蓝牌，30绿牌，31纯绿牌，32黄绿牌，40黑牌
      let $className = "";
      isAuto.value = false;

      switch (code.value) {
        case 0: // 0 其它
          $className = "plate-gray text-gray-1000";
          break;

        case 11: // 11 黄牌
          $className = "plate-yellow text-gray-1000";
          break;

        case 21: //21 蓝牌
          $className = "plate-blue text-white";
          break;

        case 30: // 30 绿牌
        case 31: // 31 纯绿牌
          $className = "plate-green text-gray-1000";
          break;

        case 32: // 32 黄绿牌
          $className = "plate-green-yellow text-gray-1000 relative";
          break;

        case 40: // 40 黑牌
          $className = "bg-black text-white";
          break;
      }

      className.value = $className;

      if (!!text.value && text.value?.length <= 2) return (label.value = text.value || "");

      const $header = (text.value || "").substring(0, 2);
      const $footer = (text.value || "").substring(2);

      if (code.value !== 32) {
        label.value = `${$header} · ${$footer}`;
      } else {
        header.value = $header;
        footer.value = $footer;
      }
    };

    const onAutoInit = () => {
      if (/[港澳]/.test(text.value || "")) {
        className.value = "text-white bg-black";
      } else if ((text.value || "").length > 7) {
        className.value = "text-white plate-green";
      } else {
        className.value = "text-gray-1000 plate-yellow";
      }

      if (!!text.value && text.value?.length <= 2) return (label.value = text.value || "");

      const header = (text.value || "").substring(0, 2);
      const footer = (text.value || "").substring(2);
      label.value = `${header} · ${footer}`;
    };

    return () => {
      return (
        <Fragment>
          {!!isAuto.value && (
            <view
              class={`${className.value} license-plate-content py-0.5 rounded-md px-2 font-medium text-xiv-7 text-center box-border inline-flex items-center`}
            >
              {label.value}
            </view>
          )}
          {!isAuto && code.value !== 32}
          {!isAuto.value && code.value !== 32 && (
            <view class={`h-8 font-semibold rounded-md px-2 text-xiv-7 inline-flex items-center ${className.value}`}>
              {label.value}
            </view>
          )}

          {!isAuto.value && code.value === 32 && (
            <view class="font-semibold text-xiv-7 items-center rounded-md inline-flex overflow-hidden">
              <view class="plate-yellow h-8 flex items-center pl-2 pr-1.5 relative">
                <text>{header.value}</text>
                <text class="plate-point absolute transform top-1.2 -translate-y-1.2">·</text>
              </view>

              <view class="plate-green h-8 flex items-center pr-2 pl-1.5">{footer.value}</view>
            </view>
          )}
        </Fragment>
      );
    };
  }
});
