import { defineComponent, reactive, ref } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElIcon, ElImage } from "element-plus";
import { User, Lock, Loading } from "@element-plus/icons-vue";
import { useUserStore, useRoutersStore } from "@/stores";
import { useRouter } from "vue-router";
import { getAssetsFile } from "@/utils";

const validateUsername = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error("请填写用户名"));
  } else {
    callback();
  }
};

const validatePassword = (rule: any, value: string, callback: any) => {
  if (!value.length) {
    callback(new Error("请填写密码"));
  } else {
    callback();
  }
};

export default defineComponent({
  name: "Login",
  setup() {
    const userStore = useUserStore();
    const routerStore = useRoutersStore();
    const router = useRouter();

    const rules = reactive({
      username: [{ validator: validateUsername }],
      password: [{ validator: validatePassword }]
    });

    const loading = ref(false);
    const form = ref();
    const info = reactive({
      username: import.meta.env.VITE_USERNAME,
      password: import.meta.env.VITE_PASSWORD
    });

    const onLogin = (e?: MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (loading.value) return;

      form.value.validate(async (valid: any) => {
        if (!valid) return;

        loading.value = true;

        // userStore.SetToken("Bearer 10003|aEyJ1gri04Od9tQ2tyOv0JnLTLniPGacMyA5a0Va");
        // routerStore.GetViews();
        // router.push("/");
        setTimeout(async () => {
          userStore.Login({
            data: {
              real_name: info.username,
              passwd: info.password
            },
            success: () => {
              routerStore.GetViews();

              setTimeout(() => {
                router.push("/");
              }, 1000 * 0.3);
            },
            fail: () => {
              loading.value = false;
            }
          });
        }, 1000 * 0.5);
      });
    };

    const onEnter = (evt: Event | KeyboardEvent) => {
      if ((evt as KeyboardEvent).key === "Enter") onLogin();
    };

    return () => {
      return (
        <div class="w-screen h-screen bg-gray-1000 bg-login-image relative">
          <div class="absolute left-1/2 -translate-x-1/2">
            <div class="text-white text-center font-medium tracking-0.2 pt-28">
              <span class="block text-5xl">惠州市博罗县神山源头治超平台</span>
              <span class="block text-lg mt-4">Huizhou Boluo County Shenshan source treatment platform</span>
            </div>

            <div class="bg-login-content mt-14 box-border flex items-center pb-20">
              <ElImage class="login-image" src={getAssetsFile("login-material.png")} />
              <div class="line-login mx-8"></div>

              <div class="w-96">
                <div class="text-3xl text-blue-1300 mb-16 font-medium">欢迎登录！</div>
                <ElForm ref={form} model={info} labelPosition="top" rules={rules} size="large">
                  <ElFormItem prop="username" class="">
                    <ElInput
                      class="h-12"
                      autocomplete="off"
                      clearable={false}
                      placeholder="请输入用户名"
                      v-model={[info.username, ["trim"]]}
                      onKeydown={onEnter}
                    >
                      {{
                        prepend: () => {
                          return (
                            <ElIcon class="pointer-events-none text-2xl">
                              <User />
                            </ElIcon>
                          );
                        }
                      }}
                    </ElInput>
                  </ElFormItem>
                  <ElFormItem prop="password">
                    <ElInput
                      type="password"
                      class="h-12"
                      placeholder="请输入密码"
                      clearable={false}
                      v-model={[info.password, ["trim"]]}
                      onKeydown={onEnter}
                    >
                      {{
                        prepend: () => {
                          return (
                            <ElIcon class="pointer-events-none text-lg">
                              <Lock />
                            </ElIcon>
                          );
                        }
                      }}
                    </ElInput>
                  </ElFormItem>

                  <div class="flex justify-center">
                    <button
                      class="h-12 w-56 rounded-full mt-5 tracking-0.2 flex items-center justify-center login-btn"
                      onClick={onLogin}
                    >
                      {!loading.value && <span class="text-white text-base">立即登录</span>}
                      {loading.value && <Loading class="w-5 h-5 text-white animate-spin" />}
                    </button>
                  </div>
                </ElForm>
              </div>
            </div>
          </div>
        </div>
      );
    };
  }
});
