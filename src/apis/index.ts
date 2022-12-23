import request from "@/utils/request";
/**
 * @brief 用户登录
 * @param {FieldProps} data
 * @returns
 */
export const login = (data: FieldProps = {}) => {
  return request({ method: "POST", url: "auth/login", data }) as Promise<FieldProps>;
};

/**
 * @brief 用户登出
 * @returns
 */
export const signOut = () => {
  return request({ method: "GET", url: "auth/logout" }) as Promise<FieldProps>;
};

/**
 * @brief 修改用户密码
 * @param {FieldProps} data
 * @returns
 */
export const changePwd = (data: FieldProps) => {
  return request({ method: "POST", url: "profile/password", data }) as Promise<FieldProps>;
};

/**
 * 获取称重数据
 * @param {FieldProps} data
 * @returns
 */
export const getWeightData = (data: FieldProps) => {
  return request({ method: "GET", url: "weight_data", params: data }) as Promise<FieldProps>;
};

/**
 * 获取称重数据详情
 * @param {string} id
 * @returns
 */
export const getWeightDetails = (id: string) => {
  return request({ method: "GET", url: `weight_data/${id}` }) as Promise<FieldProps>;
};

/**
 * 获取围栏数据
 * @param {FieldProps} data
 * @returns
 */
export const getElecfenceData = (data: FieldProps) => {
  return request({ method: "GET", url: "elecfence", params: data }) as Promise<FieldProps>;
};

/**
 * 获取围栏数据详情
 * @param {string} id
 * @returns
 */
export const getElecfenceDetails = (id: string) => {
  return request({ method: "GET", url: `elecfence/${id}` }) as Promise<FieldProps>;
};

/**
 * 获取源头企业数据
 * @param {FieldProps} data
 * @returns
 */
export const getCompanyData = (data: FieldProps) => {
  return request({ method: "GET", url: "company", params: data }) as Promise<FieldProps>;
};

/**
 * 新增源头企业
 * @param {FieldProps} data
 * @returns
 */
export const modifyCompany = (data: FieldProps) => {
  return request({ method: "POST", url: "company", data }) as Promise<FieldProps>;
};

/**
 * 获取站点列表
 * @param {FieldProps} data
 * @returns
 */
export const getStationData = (data?: FieldProps) => {
  return request({ method: "GET", url: "station", params: data || {} }) as Promise<FieldProps>;
};

/**
 * 获取站点详情
 * @param {string} id
 * @returns
 */
export const getStationDetails = (id: string) => {
  return request({ method: "GET", url: `station/${id}` }) as Promise<FieldProps>;
};

/**
 * 新增站点
 * @param {FieldProps} data
 * @returns
 */
export const createStation = (data: FieldProps) => {
  return request({ method: "POST", url: "station", data }) as Promise<FieldProps>;
};

/**
 * 修改站点
 * @param {FieldProps} data
 * @returns
 */
export const modifyStation = (data: FieldProps) => {
  const $data = { ...data };
  return request({ method: "PUT", url: `station/${data.id}`, data: delete $data.id }) as Promise<FieldProps>;
};

/**
 * 获取用户列表
 * @param {FieldProps} data
 * @returns
 */
export const getUserData = (data: FieldProps) => {
  return request({ method: "GET", url: "user", params: data }) as Promise<FieldProps>;
};

/**
 * 新增用户
 * @param {FieldProps} data
 * @returns
 */
export const createUser = (data: FieldProps) => {
  return request({ method: "POST", url: "user", data }) as Promise<FieldProps>;
};

/**
 * 编辑用户
 * @param {string} id
 * @param {FieldProps} data
 * @returns
 */
export const modifyUser = (id: string, data: FieldProps) => {
  return request({ method: "PUT", url: `user/${id}`, data }) as Promise<FieldProps>;
};

/**
 * 获取首页数据
 * @returns
 */
export const getHomeData = () => {
  return request({ method: "GET", url: "home" }) as Promise<FieldProps>;
};

/**
 * 获取省份列表
 * @returns
 */
export const getProvinceData = () => {
  return request({ method: "GET", url: "util/province" }) as Promise<FieldProps>;
};

/**
 * 获取城市列表
 * @param province_code
 * @returns
 */
export const getCityData = (province_code: number) => {
  return request({ method: "GET", url: "util/city", params: { province_code } });
};

/**
 * 获取区县列表
 * @param city_code
 * @returns
 */
export const getAreaData = (city_code: number) => {
  return request({ method: "GET", url: "util/area", params: { city_code } });
};
