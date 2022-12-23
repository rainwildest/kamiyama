import type { FormInstance } from "element-plus";
import { defineComponent, ref, onMounted, reactive, nextTick } from "vue";
import { useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElButton,
  ElEmpty,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElForm,
  ElFormItem,
  ElDialog,
  ElInput,
  ElMessage,
  ElSwitch
} from "element-plus";
import { getUserData, createUser, modifyUser } from "@/apis";
import { loadingService } from "@/utils";
import { CirclePlusFilled, ArrowRight } from "@element-plus/icons-vue";
import { DecorativeLine, Title } from "@/components";

export default defineComponent({
  name: "pound-list",
  setup() {
    // const route = useRoute();
    // const router = useRouter();
    const userStore = useUserStore();
    const { userinfo } = storeToRefs(userStore);

    const dialogVisible = ref(false);

    const tableData = ref<any[]>([]);

    const currentPage = ref(1);
    const total = ref(0);
    const pageSizes = ref([30, 50, 80, 100]);
    const pageSize = ref(pageSizes.value[0]);

    const loading = ref();

    const onBeforeClose = () => {
      onToggleDialog();
    };

    const formRef = ref<FormInstance>();
    const form = reactive({
      id: "",
      real_name: "",
      passwd: "",
      passwd_confirmation: ""
    });
    const isChangePwd = ref(true);

    const onToggleDialog = () => {
      dialogVisible.value = !dialogVisible.value;

      if (formRef.value && !dialogVisible.value) {
        formRef.value.resetFields();

        setTimeout(() => {
          form.id = "";
          isChangePwd.value = true;
        }, 1000 * 0.3);
      }
    };

    const onGetUserData = () => {
      getUserData({ page: currentPage.value, per_page: pageSize.value })
        .then(({ data }) => {
          total.value = data.meta.total;

          tableData.value = data.items.map((item: FieldProps) => ({ ...item }));
        })
        .finally(() => {
          onToggleLoading(true);
        });
    };

    onMounted(() => {
      onToggleLoading();

      onGetUserData();
    });

    const onToggleLoading = (isClose?: boolean) => {
      if (loading.value && isClose) return loading.value.close();

      loading.value = loadingService(".pound-loading");
    };

    const validatePass = (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("密码长度不小于6位"));
      } else {
        if (form.passwd_confirmation !== "") {
          if (!formRef.value) return;
          formRef.value.validateField("check_pwd", () => null);
        }
        callback();
      }
    };

    const validatePass2 = (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("请输入重复密码"));
      } else if (value.length < 6) {
        callback(new Error("密码长度不小于6位"));
      } else if (value !== form.passwd) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };

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
                <span class="text-blue-1200 text-lg">系统用户</span>
              </ElBreadcrumbItem>
            </ElBreadcrumb>

            <DecorativeLine />
          </section>
          {userinfo.value.role === 20 && (
            <section class="px-6 pb-4 pt-10">
              <ElButton color="#1EA9F1" class="!px-2 h-10" type="primary" onClick={() => (dialogVisible.value = true)}>
                <CirclePlusFilled class="w-6 h-6 text-white" />
                <span class="pl-2 text-white">新增用户</span>
              </ElButton>
            </section>
          )}

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
                  <ElTableColumn align="center" prop="real_name" label="用户名" width="280" />
                  <ElTableColumn align="center" prop="last_used_ip" label="上次登录IP地址" width="350" />
                  <ElTableColumn align="center" prop="ticket_sn" label="状态" width="250">
                    {{
                      default: (scope: any) => (
                        <div class="">
                          {userinfo.value.role === 20 && (
                            <ElSwitch
                              class="pr-4"
                              modelValue={scope.row.status === 10}
                              onChange={() => {
                                modifyUser(scope.row.id, { status: scope.row.status === 10 ? 20 : 10 }).then(() => {
                                  ElMessage({
                                    message: "修改成功",
                                    type: "success"
                                  });

                                  onToggleLoading();
                                  onGetUserData();
                                });
                              }}
                            />
                          )}
                          <span class="inline-block flex-shrink-0 dark:text-white text-gray-1200">
                            {scope.row.status === 10 ? "已启用" : "已停用"}
                          </span>
                        </div>
                      )
                    }}
                  </ElTableColumn>
                  <ElTableColumn align="center" prop="reg_time" label="注册时间" min-width="350" />
                  {/* fixed="right" */}
                  <ElTableColumn align="center" label="操作" fixed="right" min-width="343">
                    {{
                      default: (scope: any) => (
                        <div class="flex justify-center">
                          {userinfo.value.role === 20 && scope.row.role === 10 && (
                            <button
                              class="border border-blue-1200 border-solid dark:bg-sky-1100 bg-sky-50 rounded h-9 px-2.5"
                              onClick={() => {
                                // router.push(`/pound-details?sign=${scope.row.id}`);
                                isChangePwd.value = false;

                                nextTick(() => {
                                  form.id = scope.row.id;
                                  dialogVisible.value = true;
                                });
                              }}
                            >
                              <span class="text-base dark:text-white text-blue-1200">修改密码</span>
                            </button>
                          )}
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
                      onGetUserData();
                    }, 1000 * 0.2);
                  }}
                  pageSize={pageSize.value}
                  onUpdate:page-size={(val) => {
                    pageSize.value = val;
                    currentPage.value = 1;

                    onToggleLoading();

                    setTimeout(() => {
                      onGetUserData();
                    }, 1000 * 0.2);
                  }}
                  pageSizes={pageSizes.value}
                  layout="total, sizes, prev, pager, next, jumper"
                  total={total.value}
                />
              )}
            </div>
          </section>

          <ElDialog
            alignCenter
            class="corporate-dialog"
            modelValue={dialogVisible.value}
            width="630px"
            beforeClose={onBeforeClose}
            v-slots={{
              header: () => <Title text="修改用户密码"></Title>,
              footer: () => {
                return (
                  <div class="">
                    <ElButton
                      class="!h-10 w-25"
                      type="primary"
                      onClick={() => {
                        formRef.value?.validate(async (valid: any, fields: any) => {
                          if (!valid) return;

                          if (!form?.id) {
                            createUser({
                              real_name: form.real_name,
                              passwd: form.passwd,
                              passwd_confirmation: form.passwd_confirmation,
                              company_id: userStore.userinfo.company_id,
                              status: 10
                            }).then(() => {
                              ElMessage({
                                message: "新增成功",
                                type: "success"
                              });

                              onToggleLoading();
                              onGetUserData();
                            });
                          }

                          if (form.id) {
                            modifyUser(form.id, { passwd: form.passwd, passwd_confirmation: form.passwd_confirmation }).then(
                              () => {
                                ElMessage({
                                  message: "修改成功",
                                  type: "success"
                                });
                              }
                            );
                          }
                        });
                      }}
                    >
                      {form.id ? "确认修改" : "确认新增"}
                    </ElButton>
                    <ElButton class="!h-10 w-25" onClick={onToggleDialog}>
                      取消
                    </ElButton>
                  </div>
                );
              }
            }}
          >
            <ElForm class="px-6" model={form} ref={formRef} size="large" show-message={true}>
              {isChangePwd.value && (
                <ElFormItem
                  label="用户姓名"
                  labelWidth="80px"
                  prop="real_name"
                  rules={[
                    {
                      required: true,
                      message: "请输入用户姓名"
                    }
                  ]}
                >
                  <ElInput clearable placeholder="请输入用户姓名" v-model={[form.real_name, ["trim"]]} />
                </ElFormItem>
              )}

              <ElFormItem
                label="密码"
                labelWidth="80px"
                prop="passwd"
                required
                rules={[
                  {
                    validator: validatePass
                  }
                ]}
              >
                <ElInput clearable type="password" placeholder="密码长度不小于6位" v-model={[form.passwd, ["trim"]]} />
              </ElFormItem>
              <ElFormItem
                label="重复密码"
                labelWidth="80px"
                prop="passwd_confirmation"
                required
                rules={[
                  {
                    validator: validatePass2
                  }
                ]}
              >
                <ElInput
                  clearable
                  type="password"
                  placeholder="密码长度不小于6位"
                  v-model={[form.passwd_confirmation, ["trim"]]}
                />
              </ElFormItem>
            </ElForm>
          </ElDialog>
        </div>
      );
    };
  }
});
