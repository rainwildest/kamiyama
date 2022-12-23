import { defineComponent, ref, onMounted, onUpdated, onActivated } from "vue";
import Title from "@/components/Title";
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
  ElIcon,
  ElBreadcrumb,
  ElBreadcrumbItem
} from "element-plus";
import { getStationData } from "@/apis";
import { formatDate } from "@/utils/dayjs";
import { filterEmptyField, loadingService } from "@/utils";
import { CirclePlusFilled, ArrowRight } from "@element-plus/icons-vue";
import { DecorativeLine } from "@/components";

export default defineComponent({
  name: "SiteQuery",
  setup() {
    const route = useRoute();
    const router = useRouter();

    const tableData = ref<any[]>([]);

    const currentPage = ref(1);
    const total = ref(0);
    const pageSizes = ref([30, 50, 80, 100]);
    const pageSize = ref(pageSizes.value[0]);

    const formRef = ref<FormInstance>();
    const form = ref({
      // company_name: "",
      no: ""
    });

    const query = ref<FieldProps>({});

    const loading = ref();

    const onGetStationData = () => {
      getStationData({
        page: currentPage.value,
        per_page: pageSize.value,
        ...query.value
      })
        .then(({ data }) => {
          total.value = data.meta.total;

          tableData.value = data.items.map((item: FieldProps) => ({ ...item }));
          // total.value = data.total;
          // tableData.value = data.list.map((item: FieldProps) => ({
          //   ...item,
          //   rough_time: item.rough_time ? formatDate(item.rough_time, "YYYY-MM-DD HH:mm:ss") : ""
          // }));
        })
        .finally(() => {
          onToggleLoading(true);
        });
    };

    const onSearch = () => {
      query.value = filterEmptyField({ ...form.value });
      currentPage.value = 1;

      onToggleLoading();

      setTimeout(() => {
        onGetStationData();
      }, 1000 * 0.2);
    };

    const onReset = () => {
      !!formRef.value && formRef.value.resetFields();

      form.value = {
        ...form.value
      };

      query.value = {};

      onToggleLoading();

      setTimeout(() => {
        currentPage.value = 1;
        onGetStationData();
      }, 1000 * 0.3);
    };

    onMounted(() => {
      onToggleLoading();

      onGetStationData();
    });

    const onToggleLoading = (isClose?: boolean) => {
      if (loading.value && isClose) return loading.value.close();

      loading.value = loadingService(".pound-loading");
    };

    onActivated(() => {
      const { refresh } = route.params;
      if (refresh === "true") {
        onToggleLoading();
        onGetStationData();
      }
    });

    return () => {
      return (
        <div class="self-theme bg-white dark:bg-blue-1000 rounded-lg flex flex-col h-full">
          <section class="h-16 relative flex items-center px-5">
            <ElBreadcrumb separatorIcon={<ArrowRight class="dark:text-gray-1300 text-gray-1200 w-5 h-5" />}>
              {/* <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item> */}
              <ElBreadcrumbItem>
                <span class="dark:text-gray-1300 text-gray-1200 text-lg">源头站点</span>
              </ElBreadcrumbItem>
              <ElBreadcrumbItem>
                <span class="text-blue-1200 text-lg">站点查询</span>
              </ElBreadcrumbItem>
            </ElBreadcrumb>

            <DecorativeLine />
          </section>
          <section class="px-6 py-4">
            <ElForm class="grid grid-cols-5 gap-x-2 gap-y-5 mt-4" model={form} ref={formRef}>
              {/* <ElFormItem class="!mb-0 flex items-center" labelWidth="0px" prop="company_name">
                <div class="flex items-center w-full">
                  <div class="dark:text-blue-1200 text-gray-1200 w-20 text-base text-right pr-3 box-border flex-shrink-0">
                    企业名称
                  </div>
                  <ElInput placeholder="请输入企业名称" class="h-10 text-lg" v-model={[form.value.company_name, ["trim"]]} />
                </div>
              </ElFormItem> */}

              <ElFormItem class="!mb-0 flex items-center" labelWidth="0px" prop="no">
                {/* <ElInput v-model={[form.value.lorry_number, ["trim"]]} /> */}
                <div class="flex items-center w-full">
                  <div class="dark:text-blue-1200 text-gray-1200 w-20 text-base text-right pr-3 box-border flex-shrink-0">
                    站点编号
                  </div>
                  <ElInput placeholder="请输入站点编号" class="h-10 text-lg" v-model={[form.value.no, ["trim"]]} />
                </div>
              </ElFormItem>

              <div class="flex justify-end items-center col-span-4">
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
            </ElForm>
          </section>

          <section class="px-6 pt-10">
            <ElButton
              color="#1EA9F1"
              class="!px-2 h-10"
              type="primary"
              onClick={() => {
                router.push(`/edit-site`);
              }}
            >
              <CirclePlusFilled class="w-6 h-6 text-white" />
              <span class="pl-2 text-white">新增站点</span>
            </ElButton>
          </section>

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
                  <ElTableColumn align="center" prop="no" label="站点编号" width="182" />
                  <ElTableColumn align="center" prop="name" label="站点名称" width="131" />
                  {/* <ElTableColumn align="center" prop="Station.name" label="市级" width="80" />
                  <ElTableColumn align="center" prop="ticket_sn" label="县/区" width="80" />
                  <ElTableColumn align="center" prop="company.name" label="企业名称" width="180" /> */}
                  <ElTableColumn align="center" prop="address" label="站点地址" min-width="270" />
                  <ElTableColumn align="center" prop="contacts" label="联系人" min-width="100" />
                  <ElTableColumn align="center" prop="tel" label="联系电话" min-width="150" />
                  <ElTableColumn align="center" prop="bayonets_count" label="卡口数量" min-width="90" />
                  <ElTableColumn align="center" prop="net_weight" label="注册时间" min-width="200" />
                  {/* fixed="right" */}
                  <ElTableColumn align="center" label="操作" fixed="right" min-width="120">
                    {{
                      default: (scope: any) => (
                        <div class="flex justify-center">
                          <button
                            class="border border-blue-1200 border-solid dark:bg-sky-1100 bg-sky-50 rounded h-9 px-2.5"
                            onClick={() => {
                              router.push(`/edit-site?sign=${scope.row.id}`);
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
                      onGetStationData();
                    }, 1000 * 0.2);
                  }}
                  pageSize={pageSize.value}
                  onUpdate:page-size={(val) => {
                    pageSize.value = val;
                    currentPage.value = 1;

                    onToggleLoading();

                    setTimeout(() => {
                      onGetStationData();
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
