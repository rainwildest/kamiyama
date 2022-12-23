import { defineComponent, ref, shallowRef, onMounted, watch, PropType, toRefs } from "vue";
import { useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import * as echarts from "echarts";

import IconSvg from "@/components/IconSvg";

export default defineComponent({
  name: "DepartureMonth",
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

    const data = ref<FieldProps>({
      tooltip: { trigger: "axis" },
      legend: {
        orient: "vertical",
        left: "88%",
        top: "10%",
        textStyle: {
          color: isDark.value ? "#ffffff" : "#333333" //字体颜色
        }
      },

      grid: {
        left: "3%",
        right: "16%",
        bottom: "7%",
        top: "13%",
        containLabel: true
      },
      dataZoom: [
        // {
        //   show: false,
        //   realtime: true,
        //   start: 1,
        //   end: 70,
        //   xAxisIndex: [0, 1]
        // },
        {
          type: "inside",
          realtime: true,
          // start: 1,
          // end: 70,
          minValueSpan: 7,
          maxValueSpan: 7
          // xAxisIndex: [0, 1]
        }
      ],
      dataset: {
        dimensions: ["product", "正常", "超限"],
        source: []
      },
      xAxis: {
        type: "category",
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(96, 118, 173, 0.5)"
          }
        },
        axisLine: {
          lineStyle: {
            color: "rgba(96, 118, 173, 1)"
          }
        }
      },
      yAxis: {
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(96, 118, 173, 0.5)"
          }
        }
      },
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [
        {
          type: "bar",
          barGap: 0,
          barWidth: 30,
          label: {
            show: true,
            color: isDark.value ? "#ffffff" : "#333333",
            position: "top",
            offset: [1, 1]
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(63,150,255,1)" },

                { offset: 1, color: "rgba(63,150,255,0.6)" }
              ])
            }
          }
        },
        {
          type: "bar",
          barGap: 0,
          barWidth: 30,
          label: {
            show: true,
            color: isDark.value ? "#ffffff" : "#333333",
            position: "top",
            offset: [1, 1]
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(183,51,93,1)" },

                { offset: 1, color: "rgba(183,51,92,0.6)" }
              ])
            }
          }
        }
      ]
    });

    setTimeout(() => {
      if (echartContent.value) {
        eachartRender.value = echarts.init(echartContent.value, undefined, { renderer: "svg" });
        // 绘制图表
        eachartRender.value.setOption(data.value);
      }
    }, 1000);

    const initChartData = ($data: FieldProps[]) => {
      data.value.dataset.source = $data.map((item) => ({ product: item.date, 正常: item.normal, 超限: item.overload }));

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
      const series = data.value.series.map((item: FieldProps) => ({
        ...item,
        label: {
          ...item.label,
          color: isDark.value ? "#ffffff" : "#333333"
        }
      }));

      eachartRender.value.setOption({
        ...data.value,
        legend: {
          ...data.value.legend,
          textStyle: {
            color: newval ? "#ffffff" : "#333333" //字体颜色
          }
        },
        series
      });
    });

    watch(chartData, (newval) => {
      const option = initChartData(newval);

      eachartRender.value.setOption(option);
    });

    return () => {
      return (
        <div class="rounded-xl bg-white dark:bg-blue-1000 departure-month-container w-full ml-3 flex flex-col">
          <div class="h-16 relative flex items-center">
            <p class="dark:text-white text-lg px-5">本月离场数据</p>

            <div class="absolute w-full flex items-end bottom-0 pl-32">
              <IconSvg name="card-header-line" class="h-1.5 w-33 absolute left-0" />
              <div class="card-header-line w-full h-px ml-2 scale-y-50" />
            </div>
          </div>
          <div class="flex-1" ref={echartContent}></div>
        </div>
      );
    };
  }
});
