import { defineComponent, ref, onMounted, nextTick } from "vue";
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  FormInstance,
  ElEmpty,
  ElBreadcrumb,
  ElBreadcrumbItem
} from "element-plus";
import { getCompanyData, modifyCompany } from "@/apis";
import { loadingService } from "@/utils";
import { CirclePlusFilled, ArrowRight } from "@element-plus/icons-vue";
import { DecorativeLine } from "@/components";
import Modify from "../components/Modify";

export default defineComponent({
  name: "pound-list",
  setup() {
    // const route = useRoute();
    // const router = useRouter();

    const tableData = ref<any[]>([]);

    const currentPage = ref(1);
    const total = ref(0);
    const pageSizes = ref([30, 50, 80, 100]);
    const pageSize = ref(pageSizes.value[0]);

    const details = ref({});

    const formRef = ref<FormInstance>();
    const form = ref({
      name: "",
      contacts: "",
      tel: ""
    });
    const dialogVisible = ref(false);

    const query = ref<FieldProps>({});

    const loading = ref();

    const onGetCompanyData = () => {
      getCompanyData({
        page: currentPage.value,
        per_page: pageSize.value,
        ...query.value
      })
        .then(({ data }) => {
          total.value = data.meta.total;
          tableData.value = data.items.map((item: FieldProps) => ({ ...item }));
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
      query.value = { ...form.value };
      currentPage.value = 1;

      // onToggleLoading();

      setTimeout(() => {
        onGetCompanyData();
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
        onGetCompanyData();
      }, 1000 * 0.3);
    };

    onMounted(() => {
      onToggleLoading();

      onGetCompanyData();
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
                <span class="dark:text-gray-1300 text-gray-1200 text-lg">源头企业</span>
              </ElBreadcrumbItem>
              <ElBreadcrumbItem>
                <span class="text-blue-1200 text-lg">企业信息</span>
              </ElBreadcrumbItem>
            </ElBreadcrumb>

            <DecorativeLine />
          </section>

          <section class="px-6 py-4">
            <ElForm class="grid grid-cols-5 gap-x-2 gap-y-5 mt-4" model={form} ref={formRef}>
              {/* <ElFormItem class="!mb-0 flex items-center" labelWidth="0px" prop="name">
                <div class="flex items-center w-full">
                  <div class="dark:text-blue-1200 text-gray-1200 w-20 text-base text-right pr-3 box-border flex-shrink-0">
                    企业名称
                  </div>
                  <ElInput placeholder="请输入企业名称" class="h-10 text-base" v-model={[form.value.name, ["trim"]]} />
                </div>
              </ElFormItem> */}

              <ElFormItem class="!mb-0 flex items-center" labelWidth="0px" prop="contacts">
                {/* <ElInput v-model={[form.value.lorry_number, ["trim"]]} /> */}
                <div class="flex items-center w-full">
                  <div class="dark:text-blue-1200 text-gray-1200 w-20 text-base text-right pr-3 box-border flex-shrink-0">
                    联系人
                  </div>
                  <ElInput placeholder="请输入联系人" class="h-10 text-base" v-model={[form.value.contacts, ["trim"]]} />
                </div>
              </ElFormItem>

              <ElFormItem class="!mb-0 flex items-center" labelWidth="0px" prop="tel">
                {/* <ElInput v-model={[form.value.lorry_number, ["trim"]]} /> */}
                <div class="flex items-center w-full">
                  <div class="dark:text-blue-1200 text-gray-1200 w-20 text-base text-right pr-3 box-border flex-shrink-0">
                    联系号码
                  </div>
                  <ElInput placeholder="请输入联系号码" class="h-10 text-base" v-model={[form.value.tel, ["trim"]]} />
                </div>
              </ElFormItem>

              <div class="flex justify-end items-center col-span-2">
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
            <ElButton color="#1EA9F1" class="!px-2 h-10" type="primary" onClick={() => (dialogVisible.value = true)}>
              <CirclePlusFilled class="w-6 h-6 text-white" />
              <span class="pl-2 text-white">新增企业</span>
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
                  {/* <ElTableColumn align="center" prop="" label="市级" width="80" />
                  <ElTableColumn align="center" prop="" label="县/区" width="80" />
                  <ElTableColumn align="center" prop="" label="地址" min-width="283" /> */}
                  <ElTableColumn align="center" prop="name" label="企业名称" width="180" />
                  <ElTableColumn align="center" prop="contacts" label="联系人" min-width="120" />
                  <ElTableColumn align="center" prop="tel" label="联系电话" min-width="180" />
                  <ElTableColumn align="center" prop="stations_count" label="站点数量" min-width="110" />
                  <ElTableColumn align="center" prop="bayonets_count" label="卡口数量" min-width="110" />
                  <ElTableColumn align="center" prop="registe_time" label="注册时间" min-width="230" />
                  {/* fixed="right" */}
                  <ElTableColumn align="center" label="操作" fixed="right" min-width="200">
                    {{
                      default: (scope: any) => (
                        <div class="flex justify-center">
                          <button
                            class="border border-blue-1200 border-solid dark:bg-sky-1100 bg-sky-50 rounded h-9 px-2.5"
                            onClick={() => {
                              dialogVisible.value = true;

                              nextTick(() => {
                                details.value = {
                                  id: scope.row.id,
                                  credit_code: scope.row.credit_code,
                                  name: scope.row.name,
                                  contacts: scope.row.contacts,
                                  position_amap_map: scope.row.position_amap_map || { longitude: null, latitude: null }
                                };
                              });
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
                      onGetCompanyData();
                    }, 1000 * 0.2);
                  }}
                  pageSize={pageSize.value}
                  onUpdate:page-size={(val) => {
                    pageSize.value = val;
                    currentPage.value = 1;

                    onToggleLoading();

                    setTimeout(() => {
                      onGetCompanyData();
                    }, 1000 * 0.2);
                  }}
                  pageSizes={pageSizes.value}
                  layout="total, sizes, prev, pager, next, jumper"
                  total={total.value}
                />
              )}
            </div>
          </section>

          <Modify
            v-model={dialogVisible.value}
            v-model:value={details.value}
            onConfirm={(val) => {
              modifyCompany(val);

              onToggleLoading();

              setTimeout(() => {
                onGetCompanyData();
              }, 1000 * 0.3);
            }}
          />
        </div>
      );
    };
  }
});
