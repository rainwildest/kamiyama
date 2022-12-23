import type { FormRules } from "element-plus";
import { defineComponent, toRefs, ref, reactive, PropType, onMounted, watch } from "vue";
import { ElButton, ElForm, ElFormItem, ElDialog, ElSelect, ElOption, ElInput, ElMessage } from "element-plus";
import { Title, IconSvg, Map } from "@/components";
import { filterEmptyField } from "@/utils";
import _ from "lodash";
export default defineComponent({
  name: "CorporateModify",
  props: {
    value: {
      type: Object as PropType<FieldProps>,
      default: () => ({})
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ["confirm", "update:modelValue", "update:value"],
  setup(props, { emit }) {
    const { modelValue, value } = toRefs(props);
    const mapVisible = ref(false);

    const formRef = ref();
    const form = ref({
      credit_code: "" /* 统一信用代码 */,
      name: "" /* 名称 */,
      contacts: "" /* 联系人 */,
      tel: "" /* 联系电话 */,
      province: "" /*省*/,
      city: "" /* 市 */,
      county: "" /* 县 */,
      town: "" /* 镇 */,
      address: "" /* 详细地址 */,
      position_amap_map: { longitude: null, latitude: null }
    });

    const rules = reactive<FormRules>({
      credit_code: [{ required: true, message: "请输入统一社会信用代码" }],
      name: [{ required: true, message: "请输入企业名称" }],
      contacts: [{ required: true, message: "请输入联系人" }],
      tel: [{ required: true, message: "请输入联系电话" }]
    });

    const onToggleDialog = () => {
      emit("update:modelValue", false);

      setTimeout(() => {
        emit("update:value", {});
        formRef.value.resetFields();

        form.value = { ...form.value, position_amap_map: { longitude: null, latitude: null } };
      }, 1000 * 0.3);
    };

    const onBeforeClose = () => {
      onToggleDialog();
    };

    const onConfirm = () => {
      formRef.value.validate(async (valid: any, fields: any) => {
        if (!valid) {
          const keys = Object.keys(fields);
          ElMessage.error(fields[keys[0]][0].message);
          return;
        }

        emit("confirm", filterEmptyField(form.value));

        onToggleDialog();
      });
    };

    onMounted(() => {
      if (!_.keys(value.value).length) {
        form.value = { ...form.value, ...value.value };
      }
    });

    watch(value, (newval) => {
      form.value = { ...form.value, ...newval };
    });

    return () => {
      return (
        <ElDialog
          width="655px"
          align-center
          modelValue={modelValue.value}
          class="corporate-dialog"
          beforeClose={onBeforeClose}
          v-slots={{
            header: () => <Title text="新增企业" />,
            footer: () => {
              return (
                <div class="">
                  {!value.value?.id && (
                    <ElButton class="!h-10 w-25" type="primary" onClick={onConfirm}>
                      确认新增
                    </ElButton>
                  )}
                  <ElButton class="!h-10 w-25" onClick={onToggleDialog}>
                    取消
                  </ElButton>
                </div>
              );
            }
          }}
        >
          <ElForm class="pr-12" model={form} ref={formRef} rules={rules} show-message={false}>
            <ElFormItem prop="credit_code">
              <div class="flex items-center w-full">
                <div class="text-gray-1200 w-40 text-base text-right pr-3 box-border flex-shrink-0">统一社会信用代码</div>
                <ElInput
                  placeholder="请输入统一社会信用代码"
                  class="h-10 text-base"
                  readonly={!!value.value?.id}
                  autocomplete="off"
                  clearable={true}
                  v-model={[form.value.credit_code, ["trim"]]}
                />
              </div>
            </ElFormItem>
            <ElFormItem prop="name">
              <div class="flex items-center w-full">
                <div class="text-gray-1200 w-40 text-base text-right pr-3 box-border flex-shrink-0">企业名称</div>
                <ElInput
                  placeholder="请输入企业名称"
                  class="h-10 text-base"
                  autocomplete="off"
                  readonly={!!value.value?.id}
                  clearable={true}
                  v-model={[form.value.name, ["trim"]]}
                />
              </div>
              <span class="pl-40 pt-1.5 text-sm text-gray-1300">（仅限工商变更主体名称后修改）</span>
            </ElFormItem>
            <ElFormItem prop="contacts">
              <div class="flex items-center w-full">
                <div class="text-gray-1200 w-40 text-base text-right pr-3 box-border flex-shrink-0">联系人</div>
                <ElInput
                  placeholder="请输入联系人"
                  class="h-10 text-base"
                  autocomplete="off"
                  readonly={!!value.value?.id}
                  clearable={true}
                  v-model={[form.value.contacts, ["trim"]]}
                />
              </div>
            </ElFormItem>

            <ElFormItem prop="tel">
              <div class="flex items-center w-full">
                <div class="text-gray-1200 w-40 text-base text-right pr-3 box-border flex-shrink-0">联系电话</div>
                <ElInput
                  placeholder="请输入联系电话"
                  class="h-10 text-base"
                  autocomplete="off"
                  clearable={true}
                  readonly={!!value.value?.id}
                  type="number"
                  v-model={[form.value.tel, ["trim"]]}
                />
              </div>
            </ElFormItem>

            {/* <ElFormItem prop="province">
              <div class="flex items-center w-full">
                <div class="text-gray-1200 w-40 text-base text-right pr-3 box-border flex-shrink-0">省/直辖市</div>
                <ElSelect class="h-10 w-full text-base" placeholder="请输入省/直辖市" v-model={[form.value.province, ["trim"]]}>
                  <ElOption value="广东省" label="广东省" />
                </ElSelect>
              </div>
            </ElFormItem>
            <ElFormItem prop="city">
              <div class="flex items-center w-full">
                <div class="text-gray-1200 w-40 text-base text-right pr-3 box-border flex-shrink-0">市/地区/自治州/...</div>
                <ElSelect
                  class="h-10 w-full text-base"
                  placeholder="请输入市/地区/自治州/..."
                  v-model={[form.value.city, ["trim"]]}
                >
                  <ElOption value="广东省" label="广东省" />
                </ElSelect>
              </div>
            </ElFormItem>
            <ElFormItem prop="county">
              <div class="flex items-center w-full">
                <div class="text-gray-1200 w-40 text-base text-right pr-3 box-border flex-shrink-0">县/区/...</div>
                <ElSelect class="h-10 w-full text-base" placeholder="请输入县/区/..." v-model={[form.value.county, ["trim"]]}>
                  <ElOption value="广东省" label="广东省" />
                </ElSelect>
              </div>
            </ElFormItem>
            <ElFormItem prop="town">
              <div class="flex items-center w-full">
                <div class="text-gray-1200 w-40 text-base text-right pr-3 box-border flex-shrink-0">镇</div>
                <ElSelect class="h-10 w-full text-base" placeholder="请输入镇" v-model={[form.value.town, ["trim"]]}>
                  <ElOption value="广东省" label="广东省" />
                </ElSelect>
              </div>
            </ElFormItem>
            <ElFormItem prop="address">
              <div class="flex items-center w-full">
                <div class="text-gray-1200 w-40 text-base text-right pr-3 box-border flex-shrink-0">详细地址</div>
                <ElInput
                  placeholder="请输入详细地址"
                  class="h-10 text-base"
                  autocomplete="off"
                  clearable={true}
                  v-model={[form.value.address, ["trim"]]}
                />
              </div>
            </ElFormItem> */}

            <ElFormItem>
              <div class="flex items-center w-full relative">
                <div class="text-gray-1200 w-40 text-base text-right pr-3 box-border flex-shrink-0">经纬度</div>
                <div class="flex items-center w-full">
                  <ElInput
                    readonly
                    class="h-10 text-base"
                    v-model={[form.value.position_amap_map.longitude, ["trim"]]}
                    autocomplete="off"
                  />
                  <span class="pl-2">，</span>
                  <ElInput
                    readonly
                    class="h-10 text-base"
                    v-model={[form.value.position_amap_map.latitude, ["trim"]]}
                    autocomplete="off"
                  />
                </div>

                <div
                  class="w-8 h-8 absolute -right-11 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => (mapVisible.value = true)}
                >
                  <IconSvg name="map" class="w-8 h-8" />
                </div>
              </div>
            </ElFormItem>
          </ElForm>

          <Map
            v-model={mapVisible.value}
            value={{ lng: form.value.position_amap_map.longitude, lat: form.value.position_amap_map.latitude }}
            onConfirm={(val) => {
              form.value.position_amap_map = { longitude: val.lng, latitude: val.lat };
            }}
          />
        </ElDialog>
      );
    };
  }
});
