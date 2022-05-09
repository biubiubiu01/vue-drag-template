<template>
  <div class="drag-gird" :style="gridStyle">
    <slot></slot>
    <mark-line v-if="needLine" v-bind="$attrs" />
  </div>
</template>

<script>
import MarkLine from "./markLine.vue";
export default {
  components: { MarkLine },
  name: "DragGrid",
  props: {
    width: {
      type: Number,
      default: 500,
    },
    height: {
      type: Number,
      default: 500,
    },
    grid: {
      type: Boolean,
      default: true,
    },
    needLine: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    gridStyle() {
      const { width, height, grid } = this;
      return {
        width:width+'px',
        height:height+'px',
        background: grid
          ? ` url(
              "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuXzAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjIuODA4OTg4NzY0MDQ0OTQwNSIgeT0iMC4wNTYxNzk3NzUyODA4OTU2OCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48cGF0aCBkPSJNIDEwIDAgSDAgTTAgMCBWMCAxMCIgc3Ryb2tlPSIjRTdFOEVBIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PHBhdHRlcm4gaWQ9InBhdHRlcm5fMSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iNDIuODA4OTg4NzY0MDQ0OTQiIHk9IjAuMDU2MTc5Nzc1MjgwODk1NjgiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PHBhdGggZD0iTSA1MCAwIEgwIE0wIDAgVjAgNTAiIHN0cm9rZT0iI0NCQ0VEMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm5fMCkiLz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm5fMSkiLz48L3N2Zz4="
            )`
          : "",
      };
    },
  },
  created() {},
  mounted() {

  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.drag-gird {
  position: relative;
}
</style>
