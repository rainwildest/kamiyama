import { ElLoading } from "element-plus";
import storage from "./storage";
/**
 * @description 获取 assets 下的图片资源路径
 * @param {string} src 路径
 * @returns string
 */
export const getImageUrl = (src: string) => {
  const sign = src.substring(0, 2);

  let _src = "";
  if (sign !== "./") _src = `../${src}`;
  return new URL(_src, import.meta.url).href;
};

/**
 * @description 数据类型判断
 * @param {unknown} value
 * @returns string
 */
export const typeOf = (value: unknown): string => {
  /* 使用原型链来实现这一方法 */
  let res = Object.prototype.toString.call(value);

  /* 字符串分割 */
  res = res.split(" ")[1];

  /* 字符串切割 */
  res = res.substring(0, res.length - 1);

  return res.toLowerCase();
};

/**
 * @description 判断对象是否为 JSON
 * @param {string} str
 * @returns boolean
 */
export const isJSON = (str: string): boolean => {
  if (typeof str === "string") {
    try {
      const obj = JSON.parse(str);
      return typeof obj === "object" && obj ? true : false;
    } catch (e) {
      return false;
    }
  }

  return typeOf(str) === "object";
  // throw "parameter should be a string";
};

export const isNull = (value: any) => {
  return value === "" || value === undefined || value === null;
};

/**
 * 将对象转为 request 请求转为 query
 * @param args
 * @returns string
 */
export const toUrlString = <T>(args: T): string => {
  const param = Object.keys(args || {}).map((key) => `${key}=${(args as any)[key]}`);

  return param.length ? `?${param.join("&")}` : "";
};

/**
 * 判断是否为空；暂不支持判断函数与数字，两者默认返回true
 * @param {*} value 需要判断是否为空的值
 * @returns boolean
 */
export const isEmpty = (value: any) => {
  const type = typeOf(value);
  let status = true;

  if (type === "number" || type === "function") {
    return status;
  }

  switch (type) {
    case "string":
    case "array":
      status = !value.length;
      break;
    case "null":
    case "undefined":
      status = !value;
      break;
    case "object":
      status = !Object.keys(value).length;
      break;
  }
  return status;
};

/**
 * 过滤空的字面量
 * @param {object} args 需要过滤的空的字段
 * @param {boolean} hasZero 是否保留 0
 * @returns any
 */
export const filterEmptyField = (args: { [key: string]: any }, hasZero = false) => {
  const field = {};

  Object.keys(args).forEach((key) => {
    let value = args[key];
    const type = typeOf(value);

    switch (type) {
      case "string":
        value = value.trim();
        break;
      case "object":
      case "array":
        if (isEmpty(value)) value = null;
        break;
    }

    if (!hasZero) {
      if (value) (field as any)[key] = value;
    } else {
      if (value || value === 0) (field as any)[key] = value;
    }
  });

  return field;
};

export const accSubtract = (num1: number, num2: number) => {
  const num1Digits = (num1.toString().split(".")[1] || "").length;
  const num2Digits = (num2.toString().split(".")[1] || "").length;
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));

  return (Math.round(num1 * baseNum) - Math.round(num2 * baseNum)) / baseNum;
};

export const accMultiply = (num1: number, num2: number) => {
  const num1Digits = (num1.toString().split(".")[1] || "").length;
  const num2Digits = (num2.toString().split(".")[1] || "").length;
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
  return (Math.round(num1 * baseNum) * Math.round(num2 * baseNum)) / baseNum / baseNum;
};

// 手机淘宝适配方案（基于750的设计图）
export const fontSizeBace = (e: Window, t: Document): void => {
  const n = t.documentElement,
    d = e.devicePixelRatio || 1; // 设备DPR
  function i() {
    const e = (n.clientWidth / 19.2) * 0.16; // iPhone 6 布局视口375
    n.style.fontSize = e + "px";
  }
  if (
    ((function e() {
      t.body ? (t.body.style.fontSize = "16px") : t.addEventListener("DOMContentLoaded", e);
    })(),
    i(),
    e.addEventListener("resize", i),
    e.addEventListener("pageshow", function (e) {
      e.persisted && i();
    }),
    d >= 2)
  ) {
    const o = t.createElement("body"),
      a = t.createElement("div");
    (a.style.border = ".5px solid transparent"),
      o.appendChild(a),
      n.appendChild(o),
      1 === a.offsetHeight && n.classList.add("hairlines"),
      n.removeChild(o);
  }
};

export default fontSizeBace;

export const loadingService = (target: string) => {
  return ElLoading.service({
    target: document.querySelector(target) as HTMLElement,
    lock: true,
    text: "加载中...",
    background: "rgba(0, 0, 0, 0.7)"
  });
};

export const setTheme = () => {
  if (
    storage.get("theme") === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }
};

export const getAssetsFile = (url: string) => {
  return new URL(`../assets/${url}`, import.meta.url).href;
};

// 车牌颜色：0其它，11黄牌，21蓝牌，30绿牌，31纯绿牌，32黄绿牌，40黑牌
export const licenseComparison = { 其它: 0, 黄色: 11, 蓝色: 21, 绿色: 30, 纯绿色: 31, 黄绿色: 32, 黑色: 40 };
