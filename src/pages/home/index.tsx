import { defineComponent, onMounted, ref } from "vue";
import { getHomeData } from "@/apis";
import { LeaveToday, DepartureMonth, LeaveYear, OverrunYear } from "./components";

export default defineComponent({
  name: "home",
  setup() {
    const leaveToday = ref();
    const leaveYear = ref();
    const departureMonth = ref();
    const overrunYear = ref();

    onMounted(() => {
      getHomeData().then(({ data }) => {
        // 今日离场数据
        leaveToday.value = data.today;

        // 全月离场数据
        departureMonth.value = data.month;

        // 全年离场数据
        leaveYear.value = data.year;

        // 全年超限率
        overrunYear.value = data.yearTrend;
      });
    });

    return () => {
      return (
        <div class="overflow-auto h-full">
          <div class="flex w-full pr-2">
            <LeaveToday chartData={leaveToday.value} />
            <DepartureMonth chartData={departureMonth.value} />
          </div>
          <div class="pt-3 grid grid-cols-2 gap-3 pr-2">
            <LeaveYear chartData={leaveYear.value} />
            <OverrunYear chartData={overrunYear.value} />
          </div>
        </div>
      );
    };
  }
});
