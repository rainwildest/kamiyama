import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElInput,
  FormInstance,
  ElSwitch,
  ElDialog,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElMessage
} from "element-plus";
import { createStation, modifyStation, getStationDetails, getProvinceData, getAreaData } from "@/apis";
import { filterEmptyField } from "@/utils";
import { CirclePlus, ArrowRight, Remove } from "@element-plus/icons-vue";
import { DecorativeLine, IconSvg, Title, Map } from "@/components";
import storage from "@/utils/storage";

export default defineComponent({
  name: "pound-list",
  setup() {
    const route = useRoute();
    const router = useRouter();

    const formRef = ref<FormInstance>();
    const form = ref({
      id: "",
      name: "" /* 站点名称 */,
      company_id: storage.get("userinfo")?.company_id /* 企业 Id */,
      contacts: "" /* 联系人 */,
      tel: "" /* 联系电话 */,
      province: "" /* 省 */,
      city: "" /* 市 */,
      county: "" /* 区 */,
      town: "" /* 镇 */,
      address: "" /* 详细地址 */,
      bayonets: [] as Array<FieldProps>,
      position_amap_map: { longitude: null, latitude: null }
    });

    const mapVisible = ref(false);
    const dialogVisible = ref(false);

    const bayonet = ref("");

    const provinces = ref<FieldProps[]>([]);
    const cities = ref([]);
    const areas = ref([]);
    const streets = ref([]);

    const onToggleDialog = () => {
      dialogVisible.value = !dialogVisible.value;

      setTimeout(() => {
        bayonet.value = "";
      }, 1000 * 0.2);
    };

    const onBeforeClose = () => {
      onToggleDialog();
    };

    const onGetProvinceData = () => {
      getProvinceData().then(({ data }) => {
        provinces.value = [
          { value: "", label: "请选择", data: [] },
          ...data.map((item: any) => ({ value: item.province_code, label: item.name, data: item }))
        ];
      });
    };

    onMounted(() => {
      const { sign = "" } = route.query;

      if (sign) {
        Promise.all([getProvinceData(), getStationDetails(sign as string)])
          .then((datas) => {
            provinces.value = [
              { value: "", label: "请选择", data: [] },
              ...datas[0].data.map((item: any) => ({ value: item.province_code, label: item.name, data: item }))
            ];

            const data = datas[1].data;

            if (data.province) {
              /* 如果存在查找 */
              const $cities: any = provinces.value.find((item: FieldProps) => item.value === data.province);

              if ($cities) {
                cities.value = $cities?.data.cities?.map((item: FieldProps) => ({
                  value: item.city_code,
                  label: item.name
                }));
              }

              if (data.city) {
                getAreaData(data.city).then(({ data }) => {
                  areas.value = data.map((item: FieldProps) => ({ value: item.area_code, label: item.name, data: item }));

                  if (data.county) {
                    const $streets: any = areas.value.find((item: FieldProps) => item.value === data.county);

                    if ($streets) {
                      streets.value = $streets?.data.streets?.map((item: FieldProps) => ({
                        value: item.street_code,
                        label: item.name
                      }));
                    }
                  }
                });
              }
            }
            console.log(data);

            form.value = {
              ...form.value,
              id: data.id,
              name: data.name /* 站点名称 */,
              company_id: storage.get("userinfo")?.company_id /* 企业 Id */,
              contacts: data.contacts /* 联系人 */,
              tel: data.tel /* 联系电话 */,
              province: data.province /* 省 */,
              city: data.city /* 市 */,
              county: data.county /* 区 */,
              town: data.town /* 镇 */,
              address: data.address /* 详细地址 */,
              bayonets: data.bayonets,
              position_amap_map: data.position_amap_map || { longitude: null, latitude: null }
            };
          })
          .catch(() => {
            ElMessage.error("请求错误");
          });
      } else {
        onGetProvinceData();
      }
    });

    return () => {
      return (
        <div class="self-theme h-full overflow-hidden flex flex-col">
          <div class="bg-white dark:bg-blue-1000 rounded-lg">
            <section class="h-16 relative flex items-center px-5">
              <ElBreadcrumb separatorIcon={<ArrowRight class="dark:text-gray-1300 text-gray-1200 w-5 h-5" />}>
                {/* <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item> */}
                <ElBreadcrumbItem>
                  <span class="dark:text-gray-1300 text-gray-1200 text-lg">源头站点</span>
                </ElBreadcrumbItem>
                <ElBreadcrumbItem to="/site-query">
                  <span class="dark:text-gray-1300 text-gray-1200 text-lg">站点查询</span>
                </ElBreadcrumbItem>
                <ElBreadcrumbItem>
                  <span class="text-blue-1200 text-lg">新增站点</span>
                </ElBreadcrumbItem>
              </ElBreadcrumb>

              <DecorativeLine />
            </section>

            <div class="flex items-center py-5 px-5">
              <ElButton
                type="primary"
                plain
                class="w-28 !h-9 border border-solid border-blue-1200 bg-transparent focus:bg-transparent hover:bg-transparent hover:border-blue-1200"
                onClick={() => {
                  router.back();
                }}
              >
                <span class="text-blue-1200">返回</span>
              </ElButton>
              <ElButton
                type="primary"
                class="w-28 !h-9 border-none bg-blue-1200 focus:bg-blue-1200 hover:bg-blue-1200"
                onClick={() => {
                  formRef.value?.validate(async (valid, fields) => {
                    if (!valid && fields) {
                      const keys = Object.keys(fields || {});
                      ElMessage.error(fields[keys[0]][0].message);
                      return;
                    }

                    const $form: FieldProps = filterEmptyField(form.value);
                    console.log($form);
                    if (!$form.id) {
                      createStation($form).then(() => {
                        ElMessage({
                          message: "新增成功",
                          type: "success"
                        });

                        setTimeout(() => {
                          router.push({
                            name: "SiteQuery",
                            params: {
                              refresh: "true"
                            }
                          });
                        }, 1000 * 0.3);
                      });
                    }

                    if ($form.id) {
                      modifyStation($form).then(() => {
                        ElMessage({
                          message: "修改成功",
                          type: "success"
                        });

                        setTimeout(() => {
                          router.push({
                            name: "SiteQuery",
                            params: {
                              refresh: "true"
                            }
                          });
                        }, 1000 * 0.3);
                      });
                    }
                  });
                }}
              >
                <span class="text-white">保存</span>
              </ElButton>
            </div>
          </div>

          <section class="flex flex-1 w-full overflow-hidden mt-3">
            <div class="bg-white dark:bg-blue-1000 h-full overflow-auto rounded-lg flex-shrink-0 site-edit-container">
              <Title text="站点信息" class="mt-4 mb-4" title-class="text-gray-1400 text-lg" />
              <ElForm class="pl-10 pr-12" model={form} ref={formRef} show-message={false}>
                {/* <ElFormItem>
                  <div class="flex items-center w-full">
                    <div class="dark:text-blue-1200 text-gray-1200 w-40 text-base pr-3 box-border flex-shrink-0">站点编号</div>
                    <ElInput
                      placeholder="请输入站点编号"
                      class="h-10 text-base"
                      autocomplete="off"
                      clearable={true}
                      v-model={[form.value.ticket_sn, ["trim"]]}
                    />
                  </div>
                </ElFormItem> */}
                <ElFormItem prop="name">
                  <div class="flex items-center w-full">
                    <div class="dark:text-blue-1200 text-gray-1200 w-40 text-base pr-3 box-border flex-shrink-0">站点名称</div>
                    <ElInput
                      placeholder="请输入站点名称"
                      class="h-10 text-base"
                      autocomplete="off"
                      clearable={true}
                      v-model={[form.value.name, ["trim"]]}
                    />
                  </div>
                </ElFormItem>
                {/* <ElFormItem prop="company_id">
                  <div class="flex items-center w-full">
                    <div class="dark:text-blue-1200 text-gray-1200 w-40 text-base pr-3 box-border flex-shrink-0">企业名称</div>
                    <ElInput
                      placeholder="请输入企业名称"
                      class="h-10 text-base"
                      autocomplete="off"
                      clearable={true}
                      v-model={[form.value.company_id, ["trim"]]}
                    />
                  </div>
                </ElFormItem> */}
                <ElFormItem prop="contacts">
                  <div class="flex items-center w-full">
                    <div class="dark:text-blue-1200 text-gray-1200 w-40 text-base pr-3 box-border flex-shrink-0">站点联系人</div>
                    <ElInput
                      placeholder="请输入站点联系人"
                      class="h-10 text-base"
                      autocomplete="off"
                      clearable={true}
                      v-model={[form.value.contacts, ["trim"]]}
                    />
                  </div>
                </ElFormItem>
                <ElFormItem prop="tel">
                  <div class="flex items-center w-full">
                    <div class="dark:text-blue-1200 text-gray-1200 w-40 text-base pr-3 box-border flex-shrink-0">
                      站点联系电话
                    </div>
                    <ElInput
                      placeholder="请输入站点联系电话"
                      class="h-10 text-base"
                      autocomplete="off"
                      clearable={true}
                      v-model={[form.value.tel, ["trim"]]}
                    />
                  </div>
                </ElFormItem>

                <ElFormItem prop="province">
                  <div class="flex items-center w-full">
                    <div class="dark:text-blue-1200 text-gray-1200 w-40 text-base pr-3 box-border flex-shrink-0">省/直辖市</div>
                    <ElSelect
                      class="h-10 w-full text-base"
                      placeholder="请输入省/直辖市"
                      v-model={[form.value.province]}
                      onChange={(val) => {
                        form.value = { ...form.value, city: "", county: "", town: "", address: "" };

                        const $cities: any = provinces.value.find((item: FieldProps) => item.value === val);

                        if ($cities) {
                          cities.value = $cities?.data.cities?.map((item: FieldProps) => ({
                            value: item.city_code,
                            label: item.name
                          }));
                        }
                      }}
                    >
                      {provinces.value?.map((item: FieldProps) => {
                        return <ElOption value={item.value} label={item.label} />;
                      })}
                    </ElSelect>
                  </div>
                </ElFormItem>
                <ElFormItem prop="city">
                  <div class="flex items-center w-full">
                    <div class="dark:text-blue-1200 text-gray-1200 w-40 text-base pr-3 box-border flex-shrink-0">
                      市/地区/自治州/...
                    </div>
                    <ElSelect
                      class="h-10 w-full text-base"
                      placeholder="请输入市/地区/自治州/..."
                      v-model={[form.value.city]}
                      onChange={(val) => {
                        getAreaData(val).then(({ data }) => {
                          console.log(data);
                          areas.value = data.map((item: FieldProps) => ({ value: item.area_code, label: item.name, data: item }));
                        });
                      }}
                    >
                      {cities.value?.map((item: FieldProps) => (
                        <ElOption value={item.value} label={item.label} />
                      ))}
                    </ElSelect>
                  </div>
                </ElFormItem>
                <ElFormItem prop="county">
                  <div class="flex items-center w-full">
                    <div class="dark:text-blue-1200 text-gray-1200 w-40 text-base pr-3 box-border flex-shrink-0">县/区/...</div>
                    <ElSelect
                      class="h-10 w-full text-base"
                      placeholder="请输入县/区/..."
                      v-model={[form.value.county]}
                      onChange={(val) => {
                        console.log(val);
                        const $streets: any = areas.value.find((item: FieldProps) => item.value === val);
                        if ($streets) {
                          streets.value = $streets?.data.streets?.map((item: FieldProps) => ({
                            value: item.street_code,
                            label: item.name
                          }));
                        }
                        console.log($streets, areas.value);
                      }}
                    >
                      {areas.value.map((item: FieldProps) => (
                        <ElOption value={item.value} label={item.label} />
                      ))}
                    </ElSelect>
                  </div>
                </ElFormItem>
                <ElFormItem prop="town">
                  <div class="flex items-center w-full">
                    <div class="dark:text-blue-1200 text-gray-1200 w-40 text-base pr-3 box-border flex-shrink-0">镇</div>
                    <ElSelect class="h-10 w-full text-base" placeholder="请输入镇" v-model={[form.value.town]}>
                      {streets.value.map((item: FieldProps) => (
                        <ElOption value={item.value} label={item.label} />
                      ))}
                    </ElSelect>
                  </div>
                </ElFormItem>
                <ElFormItem prop="address">
                  <div class="flex items-center w-full">
                    <div class="dark:text-blue-1200 text-gray-1200 w-40 text-base pr-3 box-border flex-shrink-0">
                      站点详细地址
                    </div>
                    <ElInput
                      placeholder="请输入详细地址"
                      class="h-10 text-base"
                      autocomplete="off"
                      clearable={true}
                      v-model={[form.value.address, ["trim"]]}
                    />
                  </div>
                </ElFormItem>

                <ElFormItem>
                  <div class="flex items-center w-full relative">
                    <div class="dark:text-blue-1200 text-gray-1200 w-40 text-base pr-3 box-border flex-shrink-0">经纬度</div>
                    <div class="flex items-center w-full">
                      <ElInput
                        readonly
                        class="h-10 text-base"
                        placeholder="经度"
                        v-model={[form.value.position_amap_map.longitude, ["trim"]]}
                        autocomplete="off"
                      />
                      <span class="pl-2 dark:text-white">，</span>
                      <ElInput
                        readonly
                        class="h-10 text-base"
                        placeholder="纬度"
                        v-model={[form.value.position_amap_map.latitude, ["trim"]]}
                        autocomplete="off"
                      />
                    </div>

                    <div class="cursor-pointer mx-5" onClick={() => (mapVisible.value = true)}>
                      <IconSvg name="map" class="w-6 h-6" />
                    </div>
                  </div>
                </ElFormItem>
              </ElForm>
            </div>
            <div class="bg-white dark:bg-blue-1000 h-full w-full overflow-auto rounded-lg ml-3">
              <Title text="站点卡口信息" class="mt-4 mb-4" title-class="text-gray-1400 text-lg" />

              <section class="px-12">
                {form.value.bayonets.map((item, index) => {
                  return (
                    <div class="flex items-center mt-5">
                      <span class="inline-block flex-shrink-0 pr-4 dark:text-blue-1200 text-gray-1200">卡口编号</span>
                      <ElInput class="h-10" readonly placeholder="卡口编号" modelValue={(form.value.bayonets[index] as any).no} />
                      <span class="inline-block flex-shrink-0 px-4 dark:text-blue-1200 text-gray-1200">卡口名称</span>
                      <ElInput
                        class="h-10"
                        placeholder="卡口名称"
                        v-model={[(form.value.bayonets[index] as any).name, ["trim"]]}
                      />

                      <div class="ml-4 flex items-center w-24 flex-shrink-0">
                        {!item?.id && (
                          <div
                            class="cursor-pointer"
                            onClick={() => {
                              form.value.bayonets.splice(index, 1);
                            }}
                          >
                            <Remove class="dark:text-blue-1200 text-gray-1200 w-7 h-7" />
                          </div>
                        )}
                        {!!item?.id && (
                          <div class="">
                            <ElSwitch
                              modelValue={!!(form.value.bayonets[index] as any).is_enabled}
                              onChange={(val) => {
                                (form.value.bayonets[index] as any).is_enabled = val ? 1 : 0;
                              }}
                            />
                            <span class="inline-block flex-shrink-0 pl-2 dark:text-white text-gray-1200">
                              {(form.value.bayonets[index] as any).is_enabled ? "已启用" : "已停用"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </section>

              <div class="text-center mt-14" onClick={onToggleDialog}>
                <ElButton
                  color="#1EA9F1"
                  class="h-10 border border-solid border-blue-1200 bg-transparent focus:bg-transparent hover:bg-transparent hover:border-blue-1200"
                >
                  <CirclePlus class="w-6 h-6 text-blue-1200" />
                  <span class="pl-2 text-blue-1200 text-base">新增卡口</span>
                </ElButton>
              </div>
            </div>
          </section>

          <ElDialog
            width="655px"
            align-center
            modelValue={dialogVisible.value}
            class="corporate-dialog"
            beforeClose={onBeforeClose}
            v-slots={{
              header: () => <Title text="新增卡口" />,
              footer: () => {
                return (
                  <div class="">
                    <ElButton
                      class="!h-10 w-25"
                      type="primary"
                      onClick={() => {
                        dialogVisible.value = false;

                        form.value.bayonets.push({ name: bayonet.value });
                      }}
                    >
                      确认新增
                    </ElButton>
                    <ElButton class="!h-10 w-25" onClick={onToggleDialog}>
                      取消
                    </ElButton>
                  </div>
                );
              }
            }}
          >
            <ElForm class="pr-12" model={form}>
              <ElFormItem>
                <div class="flex items-center w-full">
                  <div class="text-gray-1200 w-40 text-base text-right pr-3 box-border flex-shrink-0">卡口名称</div>
                  <ElInput
                    placeholder="仅支持1-20字符长度"
                    class="h-10 text-base"
                    autocomplete="off"
                    clearable={true}
                    v-model={[bayonet.value, ["trim"]]}
                  />
                </div>
              </ElFormItem>
            </ElForm>
          </ElDialog>

          <Map
            v-model={mapVisible.value}
            value={{ lng: form.value.position_amap_map.longitude, lat: form.value.position_amap_map.latitude }}
            onConfirm={(val) => {
              form.value.position_amap_map = { longitude: val.lng, latitude: val.lat };
            }}
          />
        </div>
      );
    };
  }
});
