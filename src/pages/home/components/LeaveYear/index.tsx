import { defineComponent, ref, shallowRef, watch, PropType, onMounted, toRefs } from "vue";
import IconSvg from "@/components/IconSvg";
import { useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import * as echarts from "echarts";

export default defineComponent({
  name: "LeaveYear",
  props: {
    chartData: {
      type: Object as PropType<FieldProps[]>,
      default: () => []
    }
  },
  setup(props) {
    const { chartData } = toRefs(props);

    const eachartRender = shallowRef();
    const echartContent = ref<HTMLElement>();
    const userStore = useUserStore();
    const { isDark } = storeToRefs(userStore);

    const yAxis = ref({
      max: 100,
      type: "value",
      axisLine: {
        show: true
      },
      axisLabel: {
        formatter: "{value}%",
        textStyle: {
          color: isDark.value ? "#ffffff" : "#333333"
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(77, 91, 107, 0.5)",
          type: "dashed"
        }
      }
    });

    const data = ref<FieldProps>({
      legend: {
        // data: ['Line 1', 'Line 2']
        itemGap: 30,
        top: "5%",
        textStyle: {
          color: isDark.value ? "#ffffff" : "#333333" //字体颜色
        }
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(224, 236, 255, 1)",
        borderWidth: 0,
        formatter(args: any) {
          let $style = "";
          args.forEach((element: any, index: number) => {
            $style += `<div style="display: flex; justify-content: space-between; min-width: 100px">
                        <div>${args[index].marker} ${args[index].seriesName}</div>
                        <span>${args[index].data[args[index].seriesName]}%</span>
                       </div>`;
          });
          return `<div>
                    <div style="padding-bottom: 5px;">${args[0].name}</div>
                    ${$style}
                  </div>`;
        }
      },

      grid: {
        left: "3%",
        top: "20%",
        right: "6%",
        bottom: "8%",
        containLabel: true
      },
      dataset: {
        dimensions: ["product", "未超限", "超限"],
        source: []
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: new Array(12).fill(null).map((item, index) => `${index + 1}月`),
          axisLabel: {
            padding: [10, 0, 0, 0]
          }
        }
      ],
      yAxis: [yAxis.value],
      series: [
        {
          name: "未超限",
          type: "line",
          smooth: true,
          color: "rgba(0, 182, 206, 1)",
          symbolSize: 8,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(0, 180, 204, 1)"
              },
              {
                offset: 1,
                color: "rgba(20, 35, 59, 0)"
              }
            ])
          }
          // data: [80, 60, 80, 70, 60, 20, 10]
        },
        {
          name: "超限",
          type: "line",
          // stack: "Total",
          smooth: true,
          color: "rgba(234, 85, 20, 1)",
          symbolSize: 8,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(236, 103, 33, 1)"
              },
              {
                offset: 1,
                color: "rgba(0, 0, 0, 0)"
              }
            ])
          }
          // data: [20, 40, 20, 30, 40, 80, 90]
        }
      ]
    });

    const initChartData = ($data: FieldProps[]) => {
      data.value.dataset.source = $data.map((item) => ({ product: item.month, 未超限: item.normal, 超限: item.overload }));

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
        yAxis: [
          {
            ...yAxis.value,
            axisLabel: {
              ...yAxis.value.axisLabel,
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
        <div class="rounded-xl bg-white dark:bg-blue-1000 leave-year-container flex flex-col">
          <div class="h-16 relative flex items-center">
            <p class="dark:text-white text-lg px-5">全年离场数据趋势</p>

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
