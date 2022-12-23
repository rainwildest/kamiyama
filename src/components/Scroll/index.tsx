import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Scroll",
  setup(props, { slots }) {
    const padding = 15;
    const left = ref(0);
    const wrapper: any = ref(null);
    const container: any = ref(null);

    const handleScroll = (e: WheelEvent) => {
      // @ts-ignore
      const eventDelta = e?.wheelDelta || -e.deltaY * 3;
      const containerWidth = container.value.offsetWidth;
      const wrapperWidth = wrapper.value.offsetWidth;

      if (eventDelta > 0) {
        left.value = Math.min(0, left.value + eventDelta);
      } else {
        if (containerWidth - padding < wrapperWidth) {
          if (left.value < -(wrapperWidth - containerWidth + padding)) {
            // eslint-disable-next-line no-self-assign
            left.value = left.value;
          } else {
            left.value = Math.max(left.value + eventDelta, containerWidth - wrapperWidth - padding);
          }
        } else {
          left.value = 0;
        }
      }
    };

    const moveToTarget = (target: any) => {
      const containerWidth = container.value.offsetWidth;
      const targetLeft = target.offsetLeft;
      const targetWidth = target.offsetWidth;

      if (targetLeft < -left.value) {
        // tag in the left
        left.value = -targetLeft + padding;
      } else if (targetLeft + padding > -left.value && targetLeft + targetWidth < -left.value + containerWidth - padding) {
      } else {
        // tag in the right
        left.value = -(targetLeft - (containerWidth - targetWidth) + padding);
      }
    };
    return () => {
      return (
        <div
          class="scroll-container h-8 relative overflow-hidden whitespace-nowrap flex-1"
          ref={container}
          onWheel={handleScroll}
        >
          <div class="scroll-wrapper absolute" ref={wrapper} style={{ left: left.value + "px" }}>
            {slots.default ? slots.default() : ""}
          </div>
        </div>
      );
    };
  }
});
