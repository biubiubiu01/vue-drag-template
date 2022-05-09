<template>
  <div class="mark-line">
    <div
      v-for="line in lines"
      :key="line.type"
      v-show="line.show"
      :class="['drag-line', `drag-line-${line.type}`]"
      :style="lineStyle(line)"
    ></div>
  </div>
</template>

<script>
import eventBus from "./eventBus";
export default {
  name: "MarkLine",
  props: {
    guideBackground: {
      type: String,
      default: "rgb(255, 0, 204)",
    },
    guideSize: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      lines: [
        {
          type: "xt",
          position: "",
          show: false,
        },
        {
          type: "xc",
          position: "",
          show: false,
        },
        {
          type: "xb",
          position: "",
          show: false,
        },
        {
          type: "yl",
          position: "",
          show: false,
        },
        {
          type: "yc",
          position: "",
          show: false,
        },
        {
          type: "yr",
          position: "",
          show: false,
        },
      ],
      draging: false,
    };
  },
  computed: {
    lineStyle() {
      return (line) => {
        return {
          background: this.guideBackground,
          top: line.type.indexOf("y") ? line.position + "px" : "unset",
          left: line.type.indexOf("x") ? line.position + "px" : "unset",
          width: line.type.indexOf("x") ? this.guideSize + "px" : "100%",
          height: line.type.indexOf("y") ? this.guideSize + "px" : "100%",
        };
      };
    },
  },
  created() {},
  mounted() {
    eventBus.$on("moving", (type, position) => {
      this.lines.forEach((item) => (item.show = false));
      this.draging = true;
      if (type) {
        this.setMarkLine(type, position);
      }
    });
    eventBus.$on("moved", () => {
      this.lines.forEach((item) => (item.show = false));
      this.draging = false;
    });
  },
  methods: {
    setMarkLine(type, position) {
      for (let i = 0; i < this.lines.length; i++) {
        let item = this.lines[i];
        if (item.type == type) {
          item.show = true;
          item.position = position;
          break;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.mark-line {
  height: 100%;
  position: relative;
  .drag-line {
    position: absolute;
    z-index: 99;
  }
}
</style>
