import { defineComponent, KeepAlive, Transition, reactive, ref, computed, onMounted, getCurrentInstance } from "vue";
import { useTagsStore, useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import { ElContainer, ElMain, ElHeader, ElDialog, ElButton, ElForm, ElInput, ElFormItem, FormInstance } from "element-plus";
import { useRouter } from "vue-router";
import Sider from "./components/Sider";
import IconSvg from "@/components/IconSvg";
import Title from "@/components/Title";
import { changePwd } from "@/apis";
import "./styles/index.scss";

export default defineComponent({
  name: "Layout",
  props: {
    layout: {
      type: String,
      default: "layout-1"
    }
  },
  setup(props, { slots }) {
    // const route = useRoute();
    const router = useRouter();
    // const configStore = useConfigStore();
    const { proxy }: any = getCurrentInstance();

    const userStore = useUserStore();
    const tagStore = useTagsStore();
    const { tags } = storeToRefs(tagStore);
    const { userinfo, theme } = storeToRefs(userStore);
    // const { collapse } = storeToRefs(configStore);

    // const key = computed(() => route.path);
    const caches = computed(() => [...tags.value.filter((e) => e.keepAlive).map((e) => e.name)]);

    const dialogVisible = ref();

    const onBeforeClose = () => {
      onToggleDialog();
    };

    const formRef = ref<FormInstance>();
    const form = reactive({
      passwd: "",
      new_passwd: "",
      new_passwd_confirmation: ""
    });

    const onToggleDialog = () => {
      dialogVisible.value = !dialogVisible.value;

      if (formRef.value && !dialogVisible.value) {
        formRef.value.resetFields();
      }
    };

    const validatePass = (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("请输入登录密码"));
      } else {
        if (form.new_passwd_confirmation !== "") {
          if (!formRef.value) return;
          formRef.value.validateField("check_pwd", () => null);
        }
        callback();
      }
    };

    const validatePass2 = (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("请输入重复密码"));
      } else if (value !== form.new_passwd) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };

    /**
     * @brief 修改用户密码
     */
    const onChangePwd = (data: any) => {
      changePwd(data).then(() => {
        proxy.Message("修改密码成功", "success");

        onToggleDialog();
      });
    };

    const onSubmit = () => {
      if (!formRef.value) return;

      formRef.value.validate((valid) => {
        if (valid) {
          onChangePwd({
            passwd: form.passwd,
            new_passwd: form.new_passwd,
            new_passwd_confirmation: form.new_passwd_confirmation
          });
        }
      });
    };

    const onSignOut = () => {
      userStore.SignOut({
        success: () => {
          location.reload();
        }
      });
    };

    const onSetTheme = () => {
      const $theme = theme.value === "dark" ? "light" : "dark";

      userStore.SetTheme($theme);
    };

    // onMounted(() => {
    //   if (window) fontSizeBace(window, document);
    // });

    return () => {
      return (
        <div class="w-full h-full flex">
          <ElContainer class="overflow-hidden">
            <ElHeader class="relative bg-blue-1000 h-20 px-0 flex justify-between items-center">
              <IconSvg name="header-title" class="header-title-content absolute left-0 top-0 h-20" />
              {/* <IconSvg name="header-title" class="h-7 mb-8 ml-3" /> */}

              <div class="absolute right-0 flex bottom-2 pr-5">
                <div class="flex items-center text-sky-1000 text-lg pointer-events-none">
                  <IconSvg name="avatar-01" class="w-6 h-6 mr-2" />
                  欢迎您，<span>{userinfo.value.real_name}</span>
                </div>

                <button
                  class="transition-all ease-in-out duration-300 h-10 flex items-center text-sky-1000 text-lg ml-5 px-5 rounded-md hover:bg-blue-1100"
                  onClick={onToggleDialog}
                >
                  <IconSvg name="password-01" class="w-6 h-6 mr-2" />
                  <span>修改密码</span>
                </button>

                <button
                  class="transition-all ease-in-out duration-300 h-10 flex items-center text-sky-1000 text-lg ml-2.5 px-5 rounded-md hover:bg-blue-1100"
                  onClick={onSetTheme}
                >
                  <IconSvg name={theme.value === "dark" ? "dark" : "light"} class="w-6 h-6 mr-2" />
                  <span>主题</span>
                </button>

                <button
                  class="transition-all ease-in-out duration-300 h-10 flex items-center text-sky-1000 text-lg ml-2.5 px-5 rounded-md hover:bg-blue-1100"
                  onClick={onSignOut}
                >
                  <IconSvg name="exit-01" class="w-6 h-6 mr-2" />
                  <span>退出</span>
                </button>
              </div>
            </ElHeader>

            <ElContainer class="overflow-auto ">
              <Sider class="relative dark:bg-blue-1000 bg-white"></Sider>
              <ElMain class="dark:bg-blue-1100 bg-gray-1100 p-3">
                <div class="main__view h-full">
                  <router-view>
                    {{
                      default: ({ Component }: any) => (
                        <Transition mode="out-in" name="fade-transform">
                          <KeepAlive include={caches.value}>
                            <Component />
                          </KeepAlive>
                        </Transition>
                      )
                    }}
                  </router-view>
                </div>
              </ElMain>
            </ElContainer>
          </ElContainer>

          <ElDialog
            class="site-dialog"
            modelValue={dialogVisible.value}
            width="630px"
            beforeClose={onBeforeClose}
            v-slots={{
              header: () => <Title text="修改用户密码"></Title>,
              footer: () => {
                return (
                  <div class="">
                    <ElButton class="!h-10 w-25" type="primary" onClick={onSubmit}>
                      确认修改
                    </ElButton>
                    <ElButton class="!h-10 w-25" onClick={onToggleDialog}>
                      取消
                    </ElButton>
                  </div>
                );
              }
            }}
          >
            <div class="border-t border-solid border-gray-1001 mt-2"></div>
            <ElForm class="px-6 pt-6" model={form} ref={formRef} size="large">
              <ElFormItem
                label="旧密码"
                labelWidth="80px"
                prop="passwd"
                rules={[
                  {
                    required: true,
                    message: "请输入旧密码",
                    trigger: "blur"
                  }
                ]}
              >
                <ElInput clearable type="password" placeholder="请输入密码" v-model={[form.passwd, ["trim"]]} />
              </ElFormItem>

              <ElFormItem
                label="登录密码"
                labelWidth="80px"
                prop="new_passwd"
                required
                rules={[
                  {
                    validator: validatePass,
                    trigger: "blur"
                  }
                ]}
              >
                <ElInput clearable type="password" placeholder="请输入密码" v-model={[form.new_passwd, ["trim"]]} />
              </ElFormItem>
              <ElFormItem
                label="重复密码"
                labelWidth="80px"
                prop="new_passwd_confirmation"
                required
                rules={[
                  {
                    validator: validatePass2,
                    trigger: "blur"
                  }
                ]}
              >
                <ElInput
                  clearable
                  type="password"
                  placeholder="请再次重复密码"
                  v-model={[form.new_passwd_confirmation, ["trim"]]}
                />
              </ElFormItem>
            </ElForm>
          </ElDialog>
        </div>
      );
    };
  }
});
