import { defineComponent, toRefs, ref, watch, onMounted, PropType } from "vue";
import { ElButton, ElDialog, ElInput } from "element-plus";
import { Title } from "@/components";
import AMapLoader from "@amap/amap-jsapi-loader";

export default defineComponent({
  name: "Map",
  props: {
    value: {
      type: Object as PropType<FieldProps>,
      default: () => ({})
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ["confirm", "update:modelValue"],
  setup(props, { emit }) {
    const { modelValue, value } = toRefs(props);

    const position = ref({ lng: null, lat: null });

    const onToggleDialog = () => {
      emit("update:modelValue", !modelValue.value);

      setTimeout(() => {
        searchAddress.value = "";
      }, 1000 * 0.3);
    };

    const onBeforeClose = () => {
      onToggleDialog();
    };

    const markers = ref<any[]>([]);

    function initMap() {
      (window as any)._AMapSecurityConfig = {
        securityJsCode: "359faf80413851261341d00bf2d7d688"
      };

      AMapLoader.load({
        key: "1238f0a0c9addf3cda466ad932d1d357", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [
          "AMap.Scale", //工具条，控制地图的缩放、平移等
          "AMap.ToolBar", //比例尺，显示当前地图中心的比例尺
          "AMap.Geolocation", //定位，提供了获取用户当前准确位置、所在城市的方法
          "AMap.HawkEye", //鹰眼，显示缩略图
          "AMap.Geocoder",
          "AMap.AutoComplete",
          "AMap.PlaceSearch"
          // "AMap.MapType"
        ] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap) => {
        const map = new AMap.Map("map", {
          //设置地图容器id
          zoom: 15, //初始化地图层级
          viewMode: "3D", //是否为3D地图模式
          center: [value.value?.lng || 116.397436, value.value?.lat || 39.909165], //初始化地图中心点位置
          dragEnable: true, //禁止鼠标拖拽
          scrollWheel: true, //鼠标滚轮放大缩小
          doubleClickZoom: true, //双击放大缩小
          keyboardEnable: true //键盘控制放大缩小移动旋转
        });

        map.addControl(new AMap.Scale());
        map.addControl(new AMap.ToolBar());
        // map.addControl(new AMap.MapType());

        if (value.value?.lng && value.value?.lat) {
          if (markers.value.length) {
            map.remove(markers.value);
            markers.value = [];
          }

          const marker = new AMap.Marker({
            position: [value.value.lng, value.value.lat],
            // offset: new AMap.Pixel(-13, -30),
            draggable: false,
            defaultCursor: "pointer"
          });

          markers.value.push(marker);

          map.add(marker); //加载点
        }

        map.on("click", (val: any) => {
          // console.log(val, "经度：", val.lnglat.getLng(), "纬度", val.lnglat.getLat());
          const lng = val.lnglat.getLng();
          const lat = val.lnglat.getLat();

          if (markers.value.length) {
            map.remove(markers.value);
            markers.value = [];
          }

          const marker = new AMap.Marker({
            position: [lng, lat],
            // offset: new AMap.Pixel(-13, -30),
            draggable: false,
            defaultCursor: "pointer"
          });

          markers.value.push(marker);

          map.add(marker); //加载点
          position.value = { lng, lat };
        });

        // const geocoder = new AMap.Geocoder({});

        // const address = "东莞市";
        // geocoder.getLocation(address, function (status, result) {
        //   // Do Something.
        //   console.log("sddd", status);
        // });

        const auto = new AMap.AutoComplete({
          input: "tipinput" // 使用联想输入的input的id
        });

        //构造地点查询类
        // new AMap.PlaceSearch({
        //   map: map
        // });

        // console.log(placeSearch);
        // 当选中某条搜索记录时触发
        auto.on("select", (e: any) => {
          // console.log(e);
          // this.lnglat = [e.poi.location.lng, e.poi.location.lat];
          const lng = e.poi.location.lng;
          const lat = e.poi.location.lat;

          if (markers.value.length) map.remove(markers.value);

          const marker = new AMap.Marker({
            position: [lng, lat],
            // offset: new AMap.Pixel(-13, -30),
            draggable: false,
            defaultCursor: "pointer"
          });

          markers.value.push(marker);

          map.add(marker); //加载点
          map.setCenter([lng, lat]);
          map.setZoom(18);

          position.value = { lng, lat };
        });
      });
    }

    const searchAddress = ref("");

    onMounted(() => {
      // initMap();
      position.value = value.value as any;
    });

    watch(modelValue, (valnew) => {
      valnew && initMap();
    });

    watch(value, (newval) => {
      position.value = newval as any;
    });

    return () => {
      return (
        <ElDialog
          width="655px"
          align-center
          modelValue={modelValue.value}
          class="corporate-dialog"
          beforeClose={onBeforeClose}
          v-slots={{
            header: () => <Title text="经纬度选择" />,
            footer: () => {
              return (
                <div class="flex justify-between items-center">
                  <div>
                    <span class="text-base">经度：{position.value.lng}</span>
                    <span class="text-base pl-4">纬度：{position.value.lat}</span>
                  </div>
                  <div>
                    <ElButton
                      class="!h-10 w-25"
                      type="primary"
                      onClick={() => {
                        emit("update:modelValue", false);
                        emit("confirm", position.value);
                      }}
                    >
                      确认新增
                    </ElButton>
                    <ElButton class="!h-10 w-25" onClick={onToggleDialog}>
                      取消
                    </ElButton>
                  </div>
                </div>
              );
            }
          }}
        >
          <div>
            <ElInput
              placeholder="关键字搜索"
              id="tipinput"
              class="h-10 text-base"
              autocomplete="off"
              clearable={true}
              v-model={[searchAddress.value, ["trim"]]}
            />
          </div>
          <div id="map" class="w-full map-h"></div>
        </ElDialog>
      );
    };
  }
});
