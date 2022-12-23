import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElImage, ElBreadcrumb, ElBreadcrumbItem } from "element-plus";
import { getElecfenceDetails } from "@/apis";
import { licenseComparison } from "@/utils";
import { ArrowRight } from "@element-plus/icons-vue";
import { DecorativeLine, IconSvg, LicensePlate } from "@/components";

export default defineComponent({
  name: "pound-list",
  setup() {
    const route = useRoute();
    const details = ref<FieldProps>({});

    // const router = useRouter();

    onMounted(() => {
      route.query?.sign &&
        getElecfenceDetails(route.query?.sign as string).then(({ data }) => {
          details.value = {
            ...data,
            images: data.attachments.filter((item: any) => item.mime_type === 1),
            videos: data.attachments.filter((item: any) => item.mime_type === 2)
          };
        });
    });

    return () => {
      return (
        <div class="flex h-full w-full">
          <section class="bg-white dark:bg-blue-1000 rounded-lg weighing-detail-content flex flex-col flex-shrink-0">
            <div class="rounded-lg">
              <section class="h-16 relative flex items-center px-5">
                <ElBreadcrumb separatorIcon={<ArrowRight class="dark:text-gray-1300 text-gray-1200 w-5 h-5" />}>
                  {/* <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item> */}
                  <ElBreadcrumbItem>
                    <span class="dark:text-gray-1300 text-gray-1200 text-lg">站点检测</span>
                  </ElBreadcrumbItem>
                  <ElBreadcrumbItem to="/electric-fence">
                    <span class="dark:text-gray-1300 text-gray-1200 text-lg">电子围栏</span>
                  </ElBreadcrumbItem>
                  <ElBreadcrumbItem>
                    <span class="text-blue-1200 text-lg">查看详情</span>
                  </ElBreadcrumbItem>
                </ElBreadcrumb>

                <DecorativeLine />
              </section>

              <section class="pl-9 pt-4 pb-3">
                {/* <div class="flex h-12 items-center">
                  <div class="text-lg dark:text-blue-1200 text-gray-1200 w-24 flex-shrink-0 mr-7">源头企业：</div>
                  <div class="text-lg dark:text-white text-gray-1000 font-medium">{details.value.company_name}</div>
                </div> */}

                <div class="flex h-12 items-center">
                  <div class="text-lg dark:text-blue-1200 text-gray-1200 w-24 flex-shrink-0 mr-7">所属站点：</div>
                  <div class="text-lg dark:text-white text-gray-1000 font-medium">{details.value.station_name}</div>
                </div>

                <div class="flex h-12 items-center">
                  <div class="text-lg dark:text-blue-1200 text-gray-1200 w-24 flex-shrink-0 mr-7">车牌号码：</div>
                  <div class="text-lg dark:text-white text-gray-1000 font-medium">
                    {!!details.value?.lorry_info_name && (
                      <LicensePlate
                        text={details.value.lorry_info_name}
                        code={(licenseComparison as any)[details.value.lorry_info_color] || 0}
                      />
                    )}
                  </div>
                </div>

                <div class="flex h-12 items-center">
                  <div class="text-lg dark:text-blue-1200 text-gray-1200 w-24 flex-shrink-0 mr-7">轮轴数：</div>
                  <div class="text-lg dark:text-white text-gray-1000 font-medium">{details.value.lumber_axles || 0}轴</div>
                </div>

                <div class="flex h-12 items-center">
                  <div class="text-lg dark:text-blue-1200 text-gray-1200 w-24 flex-shrink-0 mr-7">超限状态：</div>
                  <div class="text-lg dark:text-white text-gray-1000 font-medium">
                    {!details.value.detection_result && details.value.detection_result !== undefined && (
                      <span class="dark:text-white text-gray-1000">正常</span>
                    )}
                    {!!details.value.detection_result && <span class="text-red-500 font-semibold">超限</span>}
                  </div>
                </div>

                <div class="flex h-12 items-center">
                  <div class="text-lg dark:text-blue-1200 text-gray-1200 w-24 flex-shrink-0 mr-7">进场时间：</div>
                  <div class="text-lg dark:text-white text-gray-1000 font-medium">{details.value.entry_time || ""}</div>
                </div>

                <div class="flex h-12 items-center">
                  <div class="text-lg dark:text-blue-1200 text-gray-1200 w-24 flex-shrink-0 mr-7">离场时间：</div>
                  <div class="text-lg dark:text-white text-gray-1000 font-medium">{details.value.exit_time || ""}</div>
                </div>

                <div class="flex h-12 items-center">
                  <div class="text-lg dark:text-blue-1200 text-gray-1200 w-24 flex-shrink-0 mr-7">停留时间：</div>
                  <div class="text-lg dark:text-white text-gray-1000 font-medium">{details.value.stay_time || ""}</div>
                </div>
              </section>
            </div>

            {/* <div class="bg-white dark:bg-blue-1000 rounded-lg flex-shrink-0 flex-1 mt-4">
              <section class="h-16 relative flex items-center px-5">
                <span class="text-lg text-gray-1200 dark:text-gray-1400">最后一次过磅信息</span>

                <DecorativeLine />
              </section>

              <section class="pl-9 pt-4 pb-3">
                <div class="flex h-12 items-center">
                  <div class="text-lg dark:text-blue-1200 text-gray-1200 w-24 flex-shrink-0 mr-7 tracking-widest">限重：</div>
                  <div class="text-lg dark:text-white text-gray-1000 font-medium">{details.value.weight_limit || 0}kg</div>
                </div>

                <div class="flex h-12 items-center">
                  <div class="text-lg dark:text-blue-1200 text-gray-1200 w-24 flex-shrink-0 mr-7 tracking-widest">实重：</div>
                  <div class="text-lg dark:text-white text-gray-1000 font-medium">{details.value.total_weight || 0}kg</div>
                </div>

                <div class="flex h-12 items-center">
                  <div class="text-lg dark:text-blue-1200 text-gray-1200 w-24 flex-shrink-0 mr-7 tracking-widest">超重：</div>
                  <div class="text-lg dark:text-white text-gray-1000 font-medium">{details.value.over_weight || 0}kg</div>
                </div>

                <div class="flex h-12 items-center">
                  <div class="text-lg dark:text-blue-1200 text-gray-1200 w-24 flex-shrink-0 mr-7 tracking-widest">超限率：</div>
                  <div class="text-lg dark:text-white text-gray-1000 font-medium">{details.value.overweight_ratio || "0%"}</div>
                </div>

                <div class="flex h-12 items-center">
                  <div class="text-lg dark:text-blue-1200 text-gray-1200 w-24 flex-shrink-0 mr-7">过磅时间：</div>
                  <div class="text-lg dark:text-white text-gray-1000 font-medium">{details.value.gross_weight_time || ""}</div>
                </div>
              </section>
            </div> */}
          </section>

          <div class="bg-white dark:bg-blue-1000 rounded-lg w-full ml-3 flex flex-col">
            <section class="h-16 relative flex items-center px-5">
              <span class="text-gray-1000 dark:text-blue-1200 text-lg">治超称重详情</span>
              <DecorativeLine />
            </section>

            <section class="grid grid-cols-2 gap-5 p-8 overflow-auto">
              {details.value.images?.map((item: any) => (
                <ElImage
                  class="h-80 w-full flex items-center overflow-hidden object-cover justify-center rounded-lg dark:bg-blue-1100 bg-gray-1100"
                  src={item.path}
                >
                  {{
                    error: () => {
                      return (
                        <div class="bg-gray-1001 w-full h-full flex flex-col items-center justify-center">
                          <IconSvg name="image-failed" />
                          <div class="text-sm font-medium text-gray-1200 text-center dark:text-white ">数据加载失败~</div>
                        </div>
                      );
                    }
                  }}
                </ElImage>
              ))}

              {details.value.videos?.map((item: any) => (
                <div class="relative rounded-lg h-80 overflow-hidden dark:bg-blue-1100 bg-gray-1100">
                  <video class="absolute w-full h-full top-0 left-0" src={item.path} controls></video>
                </div>
              ))}
            </section>
          </div>
        </div>
      );
    };
  }
});
