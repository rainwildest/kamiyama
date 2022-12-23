import { defineComponent, ref, onMounted, Fragment } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElButton,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElInput,
  ElDatePicker,
  FormInstance,
  ElEmpty,
  ElBreadcrumb,
  ElBreadcrumbItem
} from "element-plus";
import { getWeightData, getStationData } from "@/apis";
import { loadingService, licenseComparison, filterEmptyField } from "@/utils";
import { ArrowRight } from "@element-plus/icons-vue";
import { DecorativeLine, LicensePlate } from "@/components";

export default defineComponent({
  name: "pound-list",
  setup() {
    // const route = useRoute();
    const router = useRouter();

    const tableData = ref<any[]>([]);

    const currentPage = ref(1);
    const total = ref(0);
    const pageSizes = ref([30, 50, 80, 100]);
    const pageSize = ref(pageSizes.value[0]);

    const formRef = ref<FormInstance>();
    const form = ref({
      company_id: null,
      station_id: [],
      detection_time_begin: "" /* 开始检测时间 */,
      detection_time_end: "" /* 结束检测时间 */,
      detection_result: null /* 超限状态 */,
      lorry_info_name: null /* 车牌号 */,
      lumber_axles: [] /* 轮轴数 */,
      overweight_ratio_begin: null,
      overweight_ratio_end: null
    });
    const detectionTime = ref("");

    const station = ref<FieldProps[]>([]);
    const query = ref<FieldProps>({});

    const loading = ref();

    const onGetStationData = () => {
      getStationData().then(({ data }) => {
        station.value = [
          { value: "", label: "请选择" },
          ...data.map((item: FieldProps) => ({ value: item.id, label: item.name, data: item }))
        ];
      });
    };
    const onGetWeightData = () => {
      getWeightData({
        page: currentPage.value,
        per_page: pageSize.value,
        ...query.value
      })
        .then(({ data }) => {
          total.value = data.meta.total;

          tableData.value = data.items.map((item: FieldProps) => ({ ...item }));
        })
        .finally(() => {
          onToggleLoading(true);
        });
    };

    const wheelaxle = new Array(12).fill(null).map((item, index) => ({ value: index + 1, label: `${index + 1}轴` }));

    const onSearch = () => {
      // const $date: FieldProps = {};

      // if (date.value[0])
      //   $date = { rough_time_s: `${formatDate(date.value[0])} 00:00:00`, rough_time_e: `${formatDate(date.value[1])} 23:59:59` };

      currentPage.value = 1;
      query.value = filterEmptyField({ ...form.value }, true);

      onToggleLoading();

      setTimeout(() => {
        onGetWeightData();
      }, 1000 * 0.2);
    };

    const onReset = () => {
      !!formRef.value && formRef.value.resetFields();

      form.value = {
        ...form.value,
        detection_time_begin: "",
        detection_time_end: ""
      };

      query.value = {};
      detectionTime.value = "";

      onToggleLoading();

      setTimeout(() => {
        currentPage.value = 1;
        onGetWeightData();
      }, 1000 * 0.3);
    };

    onMounted(() => {
      onToggleLoading();

      onGetStationData();
      onGetWeightData();
    });

    const onToggleLoading = (isClose?: boolean) => {
      if (loading.value && isClose) return loading.value.close();

      loading.value = loadingService(".pound-loading");
    };

    return () => {
      return (
        <div class="self-theme bg-white dark:bg-blue-1000 rounded-lg flex flex-col h-full">
          <section class="h-16 relative flex items-center px-5">
            <ElBreadcrumb separatorIcon={<ArrowRight class="dark:text-gray-1300 text-gray-1200 w-5 h-5" />}>
              {/* <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item> */}
              <ElBreadcrumbItem>
                <span class="dark:text-gray-1300 text-gray-1200 text-lg">站点检测</span>
              </ElBreadcrumbItem>
              <ElBreadcrumbItem>
                <span class="text-blue-1200 text-lg">称重数据</span>
              </ElBreadcrumbItem>
            </ElBreadcrumb>

            <DecorativeLine />
          </section>
          <section class="px-6 py-4">
            <ElForm class="grid grid-cols-4 gap-x-2 gap-y-5 mt-4" model={form} ref={formRef}>
              {/* <ElFormItem class="!mb-0 flex items-center" labelWidth="0px" prop="company_id">
                <div class="flex items-center w-full">
                  <div class="dark:text-blue-1200 text-gray-1200 w-20 text-base text-right pr-3 box-border flex-shrink-0">
                    源头企业
                  </div>
                  <ElInput class="h-10 text-lg" v-model={[form.value.company_id, ["trim"]]} />
                </div>
              </ElFormItem> */}

              <ElFormItem class="!mb-0 flex items-center" labelWidth="0px" prop="ticket_sn">
                <div class="flex items-center w-full">
                  <div class="dark:text-blue-1200 text-gray-1200 w-20 text-base text-right pr-3 box-border flex-shrink-0">
                    站点
                  </div>
                  <ElSelect class="h-10 w-full" multiple collapse-tags collapse-tags-tooltip v-model={[form.value.station_id]}>
                    {station.value.map((item) => (
                      <ElOption label={item.label} value={item.value} />
                    ))}
                  </ElSelect>
                </div>
              </ElFormItem>

              <ElFormItem class="!mb-0 flex items-center" labelWidth="0px" prop="lorry_info_name">
                {/* <ElInput v-model={[form.value.lorry_number, ["trim"]]} /> */}
                <div class="flex items-center w-full">
                  <div class="dark:text-blue-1200 text-gray-1200 w-20 text-base text-right pr-3 box-border flex-shrink-0">
                    车牌号码
                  </div>
                  <ElInput class="h-10 text-lg" placeholder="请输入车牌号码" v-model={[form.value.lorry_info_name, ["trim"]]} />
                </div>
              </ElFormItem>

              <ElFormItem class="!mb-0 flex items-center" labelWidth="0px" prop="lumber_axles">
                <div class="flex items-center w-full">
                  <div class="dark:text-blue-1200 text-gray-1200 w-20 text-base text-right pr-3 box-border flex-shrink-0">
                    轮轴数
                  </div>
                  <div class="flex items-center w-full">
                    <ElSelect
                      multiple
                      collapse-tags
                      collapse-tags-tooltip
                      class="h-10 w-full"
                      placeholder="请选择轮轴数"
                      v-model={form.value.lumber_axles}
                    >
                      {wheelaxle.map((item) => (
                        <ElOption key={item.label} value={item.value} label={item.label} />
                      ))}
                    </ElSelect>
                  </div>
                </div>
              </ElFormItem>

              <ElFormItem class="!mb-0 flex items-center" labelWidth="0px" prop="detection_result">
                <div class="flex items-center w-full">
                  <div class="dark:text-blue-1200 text-gray-1200 w-20 text-base text-right pr-3 box-border flex-shrink-0">
                    超限状态
                  </div>
                  <ElSelect
                    class="h-10 w-full"
                    v-model={form.value.detection_result}
                    onChange={(val) => {
                      if (val !== 1) {
                        form.value.overweight_ratio_begin = null;
                        form.value.overweight_ratio_end = null;
                      }
                    }}
                  >
                    <ElOption label="全部" value={""} />
                    <ElOption label="正常" value={0} />
                    <ElOption label="超限" value={1} />
                  </ElSelect>
                </div>
              </ElFormItem>

              <ElFormItem v-show={form.value.detection_result === 1} class="!mb-0 flex items-center" labelWidth="0px">
                <section class="flex items-center w-full">
                  <div class="dark:text-blue-1200 text-gray-1200 w-20 text-base text-right pr-3 box-border flex-shrink-0">
                    超限率
                  </div>
                  <div class="flex items-center">
                    <ElInput class="h-10 text-lg" type="number" v-model={form.value.overweight_ratio_begin}>
                      {{
                        append: () => "%"
                      }}
                    </ElInput>
                    <span class="px-2.5 text-lg dark:text-blue-1200 ">-</span>
                    <ElInput class="h-10 text-lg" type="number" v-model={form.value.overweight_ratio_end}>
                      {{
                        append: () => "%"
                      }}
                    </ElInput>
                  </div>
                </section>
              </ElFormItem>

              <ElFormItem class="!mb-0 flex items-center overflow-hidden" labelWidth="0px">
                <div class="flex items-center h-10">
                  <div class="dark:text-blue-1200 text-gray-1200 w-20 text-base text-right pr-3 box-border flex-shrink-0">
                    检测时间
                  </div>
                  <ElDatePicker
                    class="!w-full !h-full"
                    value-format="YYYY-MM-DD"
                    modelValue={detectionTime.value}
                    onUpdate:modelValue={(val) => {
                      detectionTime.value = val;

                      form.value.detection_time_begin = val[0];
                      form.value.detection_time_end = val[1];
                    }}
                    editable={false}
                    type="daterange"
                    rangeSeparator="-"
                    startPlaceholder="开始时间"
                    endPlaceholder="结束时间"
                  />
                </div>
              </ElFormItem>
            </ElForm>
          </section>
          <div class="flex justify-center">
            <ElButton
              type="primary"
              plain
              class="w-28 !h-9 border border-solid border-blue-1200 bg-transparent focus:bg-transparent hover:bg-transparent hover:border-blue-1200"
              onClick={onReset}
            >
              <span class="text-blue-1200">重置</span>
            </ElButton>
            <ElButton
              type="primary"
              class="w-28 !h-9 border-none bg-blue-1200 focus:bg-blue-1200 hover:bg-blue-1200"
              onClick={onSearch}
            >
              <span class="text-white">搜索</span>
            </ElButton>
          </div>
          <section class="px-6 py-4 mt-2.5 flex-1 flex flex-col overflow-hidden w-full">
            {/* <Title text="磅单列表" class="mb-4" /> */}
            <div class="flex-1 overflow-hidden pound-loading">
              {!tableData.value.length && (
                <div class="w-full h-full flex justify-center items-center ml-3.5 scale-110">
                  <ElEmpty description="暂无数据" />
                </div>
              )}

              {!!tableData.value.length && (
                <ElTable data={tableData.value} height="100%" stripe>
                  {/* <ElTableColumn align="center" prop="Station.name" label="市级" width="99" />
                <ElTableColumn align="center" prop="ticket_sn" label="县/区" width="99" />
                <ElTableColumn align="center" prop="lorry_number" label="源头企业" width="175" /> */}
                  <ElTableColumn align="center" prop="station_name" label="站点" min-width="80" />
                  <ElTableColumn align="center" prop="lorry_info_name" label="车牌号码" min-width="160">
                    {{
                      default: (scope: any) =>
                        !!scope.row.lorry_info_name && (
                          <LicensePlate
                            text={scope.row.lorry_info_name}
                            code={(licenseComparison as any)[scope.row.lorry_info_color] || 0}
                          />
                        )
                    }}
                  </ElTableColumn>
                  <ElTableColumn align="center" prop="lumber_axles" label="轮轴数" min-width="80">
                    {{
                      default: (scope: any) => <div class="flex justify-center">{scope.row.lumber_axles || 0}轴</div>
                    }}
                  </ElTableColumn>
                  <ElTableColumn align="center" prop="net_weight" label="超限状态" min-width="100">
                    {{
                      default: (scope: any) => (
                        <Fragment>
                          {!scope.row.detection_result && scope.row.detection_result !== undefined && (
                            <span class="dark:text-white text-gray-1000">正常</span>
                          )}
                          {!!scope.row.detection_result && <span class="text-red-500 font-semibold">超限</span>}
                        </Fragment>
                      )
                    }}
                  </ElTableColumn>
                  <ElTableColumn align="center" prop="weight_limit" label="限重(KG)" min-width="100" />
                  <ElTableColumn align="center" prop="total_weight" label="实重(KG)" min-width="100" />
                  <ElTableColumn align="center" prop="over_weight" label="超重(KG)" min-width="100" />
                  <ElTableColumn align="center" prop="overweight_ratio" label="超限率" min-width="100">
                    {{
                      default: (scope: any) => scope.row.overweight_ratio || "0%"
                    }}
                  </ElTableColumn>
                  <ElTableColumn align="center" prop="gross_weight_time" label="毛重时间" min-width="250" />

                  <ElTableColumn align="center" label="操作" fixed="right" min-width="130px">
                    {{
                      default: (scope: any) => (
                        <div class="flex justify-center">
                          <button
                            class="border border-blue-1200 border-solid dark:bg-sky-1100 bg-sky-50 rounded h-9 px-2.5"
                            onClick={() => {
                              router.push(`/weighing-details?sign=${scope.row.id}`);
                            }}
                          >
                            <span class="text-base dark:text-white text-blue-1200">查看详情</span>
                          </button>
                        </div>
                      )
                    }}
                  </ElTableColumn>
                </ElTable>
              )}
            </div>

            <div class="flex justify-center mt-2 h-9">
              {!!tableData.value.length && (
                <ElPagination
                  currentPage={currentPage.value}
                  onUpdate:current-page={(val) => {
                    currentPage.value = val;

                    onToggleLoading();

                    setTimeout(() => {
                      onGetWeightData();
                    }, 1000 * 0.2);
                  }}
                  pageSize={pageSize.value}
                  onUpdate:page-size={(val) => {
                    pageSize.value = val;
                    currentPage.value = 1;

                    onToggleLoading();

                    setTimeout(() => {
                      onGetWeightData();
                    }, 1000 * 0.2);
                  }}
                  pageSizes={pageSizes.value}
                  layout="total, sizes, prev, pager, next, jumper"
                  total={total.value}
                />
              )}
            </div>
          </section>
        </div>
      );
    };
  }
});
