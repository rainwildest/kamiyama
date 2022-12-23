import { defineComponent, ref, shallowRef, watch, PropType, toRefs, onMounted } from "vue";
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
      legend: [
        {
          data: ["超限5%以下", "超限5%-10%", "超限10%-20%"],
          top: "3%",
          itemGap: 36,
          textStyle: {
            color: isDark.value ? "#ffffff" : "#333333" //字体颜色
          }
        },
        {
          data: ["超限20%-30%", "超限30%-40%", "超限40%以上"],
          top: "10%",
          itemGap: 30,
          textStyle: {
            color: isDark.value ? "#ffffff" : "#333333" //字体颜色
          }
        }
      ],
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(224, 236, 255, 1)",
        borderWidth: 0,
        formatter(args: any) {
          let $style = "";

          args.forEach((element: any, index: number) => {
            $style += `<div style="display: flex; justify-content: space-between; min-width: 100px">
                        <div style="padding-right: 20px;">${args[index].marker} ${args[index].seriesName}</div>
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
        dimensions: ["product", "超限5%以下", "超限5%-10%", "超限10%-20%", "超限20%-30%", "超限30%-40%", "超限40%以上"],
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
          name: "超限5%以下",
          type: "line",
          smooth: true,
          color: "rgba(0, 182, 206, 1)",
          symbolSize: 8

          // data: [80, 60, 80, 70, 60, 20, 10]
        },
        {
          name: "超限5%-10%",
          type: "line",
          // stack: "Total",
          smooth: true,
          color: "rgba(69, 61, 220, 1)",
          symbolSize: 8
          // data: [20, 40, 20, 30, 40, 80, 90]
        },
        {
          name: "超限10%-20%",
          type: "line",
          // stack: "Total",
          smooth: true,
          color: "rgba(233, 98, 143, 1)",
          symbolSize: 8
          // data: [20, 40, 20, 30, 40, 80, 90]
        },
        {
          name: "超限20%-30%",
          type: "line",
          // stack: "Total",
          smooth: true,
          color: "rgba(234, 85, 20, 1)",
          symbolSize: 8
          // data: [20, 40, 20, 30, 40, 80, 90]
        },
        {
          name: "超限30%-40%",
          type: "line",
          // stack: "Total",
          smooth: true,
          color: "rgba(225, 40, 10, 1)",
          symbolSize: 8
          // data: [20, 40, 20, 30, 40, 80, 90]
        },
        {
          name: "超限40%以上",
          type: "line",
          // stack: "Total",
          smooth: true,
          color: "rgba(190, 7, 7, 1)",
          symbolSize: 8
          // data: [10, 50, 70, 70, 90, 60, 20]
        }
      ]
    });

    const initChartData = ($data: FieldProps[]) => {
      const fileds = { a: "超限5%以下", b: "超限5%-10%", c: "超限10%-20%", d: "超限20%-30%", e: "超限30%-40%", f: "超限40%以上" };

      data.value.dataset.source = $data.map((item) => ({
        product: item.month,
        [fileds.a]: item.a,
        [fileds.b]: item.b,
        [fileds.c]: item.c,
        [fileds.d]: item.d,
        [fileds.e]: item.e,
        [fileds.f]: item.f
      }));

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

    watch(isDark, (newval) => {
      const legend = data.value.legend.map((item: any) => ({
        ...item,
        textStyle: {
          color: isDark.value ? "#ffffff" : "#333333" //字体颜色
        }
      }));

      eachartRender.value.setOption({
        ...data.value,
        legend: legend,
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
        <div class="rounded-xl bg-white dark:bg-blue-1000 overrun-year-container flex flex-col">
          <div class="h-16 relative flex items-center">
            <p class="dark:text-white text-lg px-5">全年超限数据趋势</p>

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
