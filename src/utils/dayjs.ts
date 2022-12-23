import dayjs, { ManipulateType } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import weekday from "dayjs/plugin/weekday";
import calendar from "dayjs/plugin/calendar";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import "dayjs/locale/zh-cn";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

dayjs.locale("zh-cn");
dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(weekday);

/**
 * 相对时间
 * @param tiem 时间
 * @returns string
 */
export const relative = (tiem: string): string => dayjs().to(dayjs(tiem));

/**
 * 格式时间
 * @param time 时间
 * @param format 格式
 * @returns string
 */
export const formatDate = (time: string | number | Date | dayjs.Dayjs | null | undefined, format = "YYYY-MM-DD"): string =>
  dayjs(time).format(format);

/**
 * @description 转IOS 8601字符串
 * @param {string | number | Date | dayjs.Dayjs} time
 * @returns string
 */
export const toISOString = (time: string | number | Date | dayjs.Dayjs): string => dayjs(time).toISOString();

/**
 * @description 获取当前日期
 * @param format 输出的格式
 * @returns string
 */
export const getCurrentDate = (format = "YYYY-MM-DD"): string => dayjs().format(format);

/**
 * @description 获取当月天数
 * @param {string | number | Date | dayjs.Dayjs} date
 * @returns
 */
export const getDaysInMonth = (date?: string | number | Date | dayjs.Dayjs): number => {
  const $time = date ? date : getCurrentDate();

  return dayjs($time).daysInMonth();
};

export const getCalendar = (time: string | null = null): string => {
  return dayjs().calendar(time, {
    sameDay: dayjs(time).to(dayjs()), // The same day ( Today at 2:30 AM )
    nextDay: `昨天 ${formatDate(time, "HH:mm")}`, // The next day ( Tomorrow at 2:30 AM )
    nextWeek: `${formatDate(time, "YYYY-MM-DD HH:mm")}`, // The next week ( Sunday at 2:30 AM )
    lastDay: `明天 ${formatDate(time, "HH:mm")}`, // The day before ( Yesterday at 2:30 AM )
    lastWeek: `${formatDate(time, "YYYY-MM-DD HH:mm")}`, // Last week ( Last Monday at 2:30 AM )
    sameElse: `${formatDate(time, "YYYY-MM-DD HH:mm")}` // Everything else ( 7/10/2011 )
  });
};

/**
 * @description 根据年月份得到周数据
 * @param {string} current 当前日期
 * @param {string} format 格式化类型
 * @param {boolean} force
 */
export function getWeeksByMonth(current: string, format = "MM-DD", force = true) {
  const $year = formatDate(current, "YYYY");
  let $month: string | number = formatDate(current, "MM");

  // 2021-12-1是11月的第5周（对这种情况进行判断）
  if (dayjs(current).date() < dayjs(current).day() && force) $month = parseInt($month) - 1;

  const len = dayjs(`${$year}-${$month}`).daysInMonth();
  const weeks: Array<FieldProps> = [];

  const startIndex = 0;
  const endIndex = 6;
  const weekControl = {
    "week-0": "周一",
    "week-1": "周二",
    "week-2": "周三",
    "week-3": "周四",
    "week-4": "周五",
    "week-5": "周六",
    "week-6": "周日"
  };

  for (let i = 0; i < len; ++i) {
    const date = dayjs(`${$year}-${$month}-${i + 1}`);

    if (date.day() === 1) {
      const $start = date.weekday(startIndex);
      const $end = date.weekday(endIndex);
      const index = weeks.length + 1;

      weeks.push({
        year: $year,
        month: $month,
        startDate: dayjs($start).format("YYYY-MM-DD"),
        endDate: dayjs($end).format("YYYY-MM-DD"),

        text: `第${index}周 (${$start.format(format)}日 - ${$end.format(format)}日)`,

        startWeek: `${$start.format(format)} (${weekControl[`week-${startIndex}`]})`,
        endWeek: `${$end.format(format)} (${weekControl[`week-${endIndex}`]})`,
        startDay: parseInt($start.format(format)),
        endDay: parseInt($end.format(format)),

        index: index //1:该月第一周   2:该月第二周
      });
    }
  }

  return weeks;
}

/**
 * @description 减去指定的时间
 * @returns Dayjs
 */
export const subtract = (value: number, unit?: ManipulateType, date?: string | number | Date | dayjs.Dayjs) => {
  return dayjs(date).subtract(value, unit).format("YYYY-MM-DD");
};

export default dayjs;
