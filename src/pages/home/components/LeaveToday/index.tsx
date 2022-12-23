import { defineComponent, ref, PropType, toRefs, onMounted, watch } from "vue";
import IconSvg from "@/components/IconSvg";
import * as echarts from "echarts";
import { useUserStore } from "@/stores";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "LeaveToday",
  props: {
    chartData: {
      type: Object as PropType<FieldProps[]>,
      default: () => []
    }
  },
  setup(props) {
    const { chartData } = toRefs(props);

    const eachartRender = ref();
    const echartContent = ref<HTMLElement>();
    const userStore = useUserStore();
    const { isDark } = storeToRefs(userStore);

    const series = ref<FieldProps>({
      label: {
        formatter: (arg: any) => {
          return `{name|${arg.name}} {value|${arg.value}}\n`;
        },
        minMargin: 5,
        edgeDistance: 10,
        lineHeight: 30,
        rich: {},
        textStyle: {
          color: isDark.value ? "#ffffff" : "#333333"
        }
      },
      labelLine: {
        normal: {
          length: 20, //第一条线
          maxSurfaceAngle: 0
        }
      },
      labelLayout: function (params: any) {
        const isLeft = params.labelRect.x < eachartRender.value.getWidth() / 2;
        const points = params.labelLinePoints;
        // Update the end point.
        points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width;

        return { labelLinePoints: points };
      },
      center: ["45%", "50%"],
      name: "今日离场数据",
      type: "pie",
      radius: "80%",
      color: ["#1EA9F1", "#ED6390"],
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    });

    const data = ref<FieldProps>({
      tooltip: {
        trigger: "item"
      },
      legend: {
        orient: "vertical",
        left: "85%",
        top: "10%",
        textStyle: {
          color: isDark.value ? "#ffffff" : "#333333" //字体颜色
        }
      },
      series: []
    });

    const initChartData = ($data: FieldProps[]) => {
      series.value.data = [
        { value: $data[0].normal, name: "正常" },
        { value: $data[0].overload, name: "超限" }
      ];

      data.value.series = [series.value];

      return data.value;
    };

    onMounted(() => {
      if (echartContent.value) {
        eachartRender.value = echarts.init(echartContent.value, undefined, { renderer: "svg" });

        if (chartData.value.length) {
          const option = initChartData(chartData.value);
          eachartRender.value.setOption(option);
        }
      }
    });

    /* 监听主题颜色的变化 */
    watch(isDark, (newval) => {
      eachartRender.value.setOption({
        ...data.value,
        legend: {
          ...data.value.legend,
          textStyle: {
            color: newval ? "#ffffff" : "#333333" //字体颜色
          }
        },
        series: [
          {
            ...series.value,
            label: {
              ...series.value,
              textStyle: {
                color: isDark.value ? "#ffffff" : "#333333"
              }
            }
          }
        ]
      });
    });

    watch(chartData, (newval) => {
      const option = initChartData(newval);
      eachartRender.value.setOption(option);
    });

    return () => {
      return (
        <div class="rounded-xl bg-white dark:bg-blue-1000 leave-today-container flex-shrink-0 flex flex-col">
          <div class="h-16 relative flex items-center">
            <p class="dark:text-white text-lg px-5">今日离场数据</p>

            <div class="absolute w-full flex items-end bottom-0 pl-32">
              <IconSvg name="card-header-line" class="h-1.5 w-33 absolute left-0" />
              <div class="card-header-line w-full h-px scale-y-50 ml-2" />
            </div>
          </div>

          <div class="flex-1 box-border" ref={echartContent}></div>
        </div>
      );
    };
  }
});
