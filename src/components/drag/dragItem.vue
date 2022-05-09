<template>
  <div
    :class="[
      'vue-drag-resize',
      {
        active: active,
        'vue-drag-moving': draging,
        'vue-drag-resizing': resizing,
      },
    ]"
    :style="dragStyle"
    @mousedown.stop.prevent="handleDragStart($event)"
  >
    <slot></slot>
    <template v-if="active && isResizable">
      <div
        v-for="stick in sticks"
        :key="stick"
        :class="['vue-drag-stick', `vue-drag-stick-${stick}`]"
        :style="stickStyle(stick)"
        @mousedown.stop.prevent="handleResizeStart(stick, $event)"
      ></div>
    </template>
    <div class="vue-drag-info" v-if="draging || resizing">
      <span v-if="draging">X：{{ boxStyle.left }}，Y：{{ boxStyle.top }}</span>
      <span v-if="resizing"
        >H：{{ boxStyle.height }}，W：{{ boxStyle.width }}</span
      >
    </div>
  </div>
</template>

<script>
const stickPosition = {
  x: {
    l: "left",
    m: "marginLeft",
    r: "right",
  },
  y: {
    t: "top",
    m: "marginTop",
    b: "bottom",
  },
};
import eventBus from "./eventBus";
export default {
  name: "DragItem",
  props: {
    w: {
      type: Number,
      default: 200,
    },
    h: {
      type: Number,
      default: 200,
    },
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    zIndex: {
      type: Number | String,
      default: 10,
    },
    sticks: {
      type: Array,
      default: () => {
        return ["tl", "tm", "tr", "ml", "mr", "bl", "bm", "br"];
      },
    },
    stickSize: {
      type: Number,
      default: 8,
    },
    isResizable: {
      type: Boolean,
      default: true,
    },
    isDraggable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    minWidth: {
      type: Number,
      default: 50,
    },
    minHeight: {
      type: Number,
      default: 50,
    },
    snap: {
      type: Boolean,
      default: true,
    },
    snapNumber: {
      type: Number,
      default: 1,
    },
    isConflictCheck: {
      type: Boolean,
      default: true,
    },
    parentLimit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      draging: false,
      resizing: false,
      active: false,
      boxStyle: {
        top: "",
        left: "",
        width: "",
        height: "",
      },
      currentStick: null,
      beforeMove: {
        left: null,
        top: null,
        width: null,
        height: null,
        oldPageX: null,
        oldPageY: null,
      },
    };
  },
  computed: {
    dragStyle() {
      const { zIndex } = this;
      const { top, left, width, height } = this.boxStyle;
      return {
        left: left + "px",
        top: top + "px",
        zIndex: zIndex,
        width: width + "px",
        height: height + "px",
      };
    },
    stickStyle() {
      const { stickSize } = this;
      return (stick) => {
        let stickObj = {
          width: stickSize + "px",
          height: stickSize + "px",
        };
        stickObj[stickPosition.y[stick[0]]] = -stickSize / 2 + "px";
        stickObj[stickPosition.x[stick[1]]] = -stickSize / 2 + "px";
        return stickObj;
      };
    },
    parenWidth() {
      return this.$parent.width;
    },
    parentHeight() {
      return this.$parent.height;
    },
  },
  created() {
    document.addEventListener("mousedown", this.deactive);
    this.$once("hook:beforeDestory", () => {
      document.removeEventListener("mousedown", this.deactive);
    });
  },
  methods: {
    deactive() {
      this.active = false;
    },

    //缩放开始
    handleResizeStart(stick, event) {
      event.stopPropagation();
      this.currentStick = stick;
      const { pageX, pageY } = event;
      this.resizing = true;
      this.setBeforeMove({ oldPageX: pageX, oldPageY: pageY });
      document.onmousemove = (event) => this.handleResizeMove(event);
      document.onmouseup = async () => {
        document.onmousemove = null;
        document.onmouseup = null;
        this.currentStick = null;
        const { left, top, width, height } = this.beforeMove;
        let bool = false;
        if (this.isConflictCheck) {
          bool = await this.conflictCheck();
        }
        if (bool) {
          this.boxStyle.left = left;
          this.boxStyle.top = top;
          this.boxStyle.height = height;
          this.boxStyle.width = width;
        }
        this.$emit("resized", this.boxStyle);
        this.beforeMove = {
          left: null,
          top: null,
          width: null,
          height: null,
          oldPageX: null,
          oldPageY: null,
        };
        this.resizing = false;
      };
    },

    //存储resize前位置信息
    setBeforeMove(position) {
      const { left, top, height, width } = this.boxStyle;
      this.beforeMove = {
        left,
        top,
        height,
        width,
        ...position,
      };
    },

    //缩放移动
    handleResizeMove(event) {
      let { pageX, pageY } = event;
      let { top, left, height, width, oldPageX, oldPageY } = this.beforeMove;
      let newHeight = height,
        newWidth = width,
        newTop = top,
        newLeft = left;

      //y轴

      switch (this.currentStick) {
        case "tl":
          newTop = pageY - oldPageY + top;
          newLeft = pageX - oldPageX + left;
          newHeight = oldPageY - pageY + height;
          newWidth = oldPageX - pageX + width;
          break;
        case "tm":
          newHeight = oldPageY - pageY + height;
          newTop = pageY - oldPageY + top;
          break;
        case "tr":
          newTop = pageY - oldPageY + top;
          newHeight = oldPageY - pageY + height;
          newWidth = pageX - oldPageX + width;
          break;

        case "ml":
          newLeft = pageX - oldPageX + left;
          newWidth = oldPageX - pageX + width;
          break;
        case "mr":
          newWidth = pageX - oldPageX + width;
          break;
        case "bl":
          newLeft = pageX - oldPageX + left;
          newWidth = oldPageX - pageX + width;
          newHeight = pageY - oldPageY + height;
          break;
        case "bm":
          newHeight = pageY - oldPageY + height;
          break;
        case "br":
          newHeight = pageY - oldPageY + height;
          newWidth = pageX - oldPageX + width;
          break;
        default:
          break;
      }
      if (newWidth >= this.minWidth) {
        this.boxStyle.left = newLeft;
        this.boxStyle.width = newWidth;
        this.$emit("update:w", this.boxStyle.width);
        this.$emit("update:x", this.boxStyle.left);
      }
      if (newHeight >= this.minHeight) {
        this.boxStyle.top = newTop;
        this.boxStyle.height = newHeight;
        this.$emit("update:h", this.boxStyle.height);
        this.$emit("update:y", this.boxStyle.top);
      }

      this.$emit("resizing", {
        width: this.boxStyle.width,
        height: this.boxStyle.height,
        left: this.boxStyle.left,
        top: this.boxStyle.top,
      });
    },

    //移动开始
    handleDragStart(event) {
      this.active = true;
      event.stopPropagation();
      if (!this.isDraggable) {
        return;
      }
      const { pageX, pageY } = event;
      this.setBeforeMove({ oldPageX: pageX, oldPageY: pageY });
      this.draging = true;
      document.onmousemove = (event) => this.handleDragMove(event);
      document.onmouseup = async () => {
        document.onmousemove = null;
        document.onmouseup = null;
        eventBus.$emit("moved");
        const { left, top } = this.beforeMove;
        let bool = false;
        if (this.isConflictCheck) {
          bool = await this.conflictCheck();
        }
        if (bool) {
          this.boxStyle.left = left;
          this.boxStyle.top = top;
        }
        this.$emit("draged", {
          left: this.boxStyle.left,
          top: this.boxStyle.top,
        });
        this.beforeMove = {
          left: null,
          top: null,
          width: null,
          height: null,
          oldPageX: null,
          oldPageY: null,
        };
        this.draging = false;
      };
    },

    //移动中
    async handleDragMove(event) {
      let { pageX, pageY } = event;
      let { top, left, oldPageX, oldPageY } = this.beforeMove;

      let newTop = 0,
        newLeft = 0;
      if (this.snap && this.snapNumber > 0) {
        newTop =
          Math.round((pageY - oldPageY) / this.snapNumber) * this.snapNumber +
          top;
        newLeft =
          Math.round((pageX - oldPageX) / this.snapNumber) * this.snapNumber +
          left;
      } else {
        newTop = pageY - oldPageY + top;
        newLeft = pageX - oldPageX + left;
      }
      let snapObj = {
        left: newLeft,
        top: newTop,
      };
      if (this.snap) {
        snapObj = await this.snapCheck({
          left: newLeft,
          top: newTop,
          width: this.beforeMove.width,
          height: this.beforeMove.height,
        });
      }

      Object.assign(this.boxStyle, snapObj);
      this.$emit("update:x", snapObj.left);
      this.$emit("update:y", snapObj.top);
      this.$emit("draging", snapObj);
    },

    //检测是否冲突
    conflictCheck() {
      return new Promise((resolve) => {
        let childNode = this.$el.parentNode.childNodes;
        const { top, left, width, height } = this.boxStyle;
        //检测是否超出边界

        if (this.parentLimit) {
          if (
            top < 0 ||
            left < 0 ||
            top + height > this.parentHeight ||
            left + width > this.parenWidth
          ) {
            resolve(true);
          }
        }
        for (let i = 0; i < childNode.length - 1; i++) {
          let node = childNode[i];
          if (
            node.className.includes("vue-drag-moving") ||
            node.className.includes("vue-drag-resizing")
          ) {
            continue;
          }
          let style = node.style;
          if (
            left + width > parseFloat(style.left) &&
            parseFloat(style.left) + parseFloat(style.width) > left &&
            top + height > parseFloat(style.top) &&
            parseFloat(style.top) + parseFloat(style.height) > top
          ) {
            resolve(true);
          }
        }
        resolve(false);
      });
    },

    //吸附对齐
    snapCheck(obj) {
      let { width, height, left, top } = obj;
      //这里+15是为了扩大吸附范围
      let snapNumber = this.snapNumber + 15;
      return new Promise((resolve) => {
        const childNode = this.$el.parentNode.childNodes;
        for (let i = 0; i < childNode.length - 1; i++) {
          let node = childNode[i];
          if (node.className.includes("vue-drag-moving")) {
            continue;
          }
          let style = node.style;
          let cw = parseFloat(style.width),
            ch = parseFloat(style.height),
            cl = parseFloat(style.left),
            ct = parseFloat(style.top);

          //左对左
          const lTol = Math.abs(cl - left) < snapNumber;
          //右对右
          const rTor = Math.abs(cl + cw - left - width) < snapNumber;
          //左对右
          const lToR = Math.abs(cw + cl - left) < snapNumber;
          //右对左
          const rTol = Math.abs(cl - left - width) < snapNumber;
          //中对中
          const cToc = Math.abs(cl + cw / 2 - left - width / 2) < snapNumber;

          //顶对顶
          const tTot = Math.abs(ct - top) < snapNumber;
          //顶对底
          const tTob = Math.abs(ct - top - height) < snapNumber;
          //底对底
          const bTob = Math.abs(ct + ch - top - height) < snapNumber;
          //底对顶
          const bTot = Math.abs(ct + ch - top) < snapNumber;
          //中对中
          const CToC = Math.abs(ct + ch / 2 - top - height / 2) < snapNumber;
          if (
            lTol ||
            rTor ||
            lToR ||
            rTol ||
            cToc ||
            tTot ||
            tTob ||
            bTob ||
            bTot
          ) {
            if (lTol) {
              left = cl;
              eventBus.$emit("moving", "yl", left);
            }
            if (rTor) {
              left = cl + cw - width;
              eventBus.$emit("moving", "yr", cl + cw);
            }
            if (lToR) {
              left = cw + cl;
              eventBus.$emit("moving", "yl", left);
            }
            if (rTol) {
              left = cl - width;
              eventBus.$emit("moving", "yr", cl);
            }
            if (cToc) {
              left = cl + cw / 2 - width / 2;
              eventBus.$emit("moving", "yc", cl + cw / 2);
            }
            if (tTot) {
              top = ct;
              eventBus.$emit("moving", "xt", top);
            }
            if (tTob) {
              top = ct - height;
              eventBus.$emit("moving", "xt", ct);
            }
            if (bTob) {
              top = ct + ch - height;
              eventBus.$emit("moving", "xt", ct + ch);
            }
            if (bTot) {
              top = ct + ch;
              eventBus.$emit("moving", "xt", top);
            }
            if (CToC) {
              top = ct + ch / 2 - height / 2;
              eventBus.$emit("moving", "xc", ct + ch / 2);
            }
          } else {
            eventBus.$emit("moving");
          }
        }
        resolve({ left, top, width, height });
      });
    },
  },

  watch: {
    active(nl) {
      this.$emit(nl ? "activated" : "deactivated");
    },
    isActive: {
      handler(nl) {
        this.active = nl;
      },
      immediate: true,
    },
    x: {
      handler(nl) {
        this.boxStyle.left = nl;
      },
      immediate: true,
    },
    y: {
      handler(nl) {
        this.boxStyle.top = nl;
      },
      immediate: true,
    },
    h: {
      handler(nl) {
        this.boxStyle.height = nl;
      },
      immediate: true,
    },
    w: {
      handler(nl) {
        this.boxStyle.width = nl;
      },
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.vue-drag-resize {
  position: absolute;
  box-sizing: border-box;
  &.active:before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    outline: 1px dashed #409eff;
  }
  .vue-drag-stick {
    position: absolute;
    border: 2px solid #409eff;
    box-sizing: border-box;
    background: #fff;
    border-radius: 50%;
  }
  .vue-drag-stick-tl,
  .vue-drag-stick-br {
    cursor: nwse-resize;
  }
  .vue-drag-stick-tm,
  .vue-drag-stick-bm {
    left: 50%;
    cursor: ns-resize;
  }
  .vue-drag-stick-tr,
  .vue-drag-stick-bl {
    cursor: nesw-resize;
  }
  .vue-drag-stick-ml,
  .vue-drag-stick-mr {
    top: 50%;
    cursor: ew-resize;
  }
  .vue-drag-info {
    position: absolute;
    bottom: -33px;
    left: 50%;
    border-radius: 4px;
    transform: translateX(-50%);
    background: #fff;
    border: 1px solid #303133;
    z-index: 2075;
    padding: 6px 14px;
    font-size: 12px;
    line-height: 1.2;
    min-width: 100px;
    word-wrap: break-word;
    &::before {
      content: "";
      border-style: solid;
      border-width: 0 5px 5px;
      border-color: transparent transparent #303133;
      position: absolute;
      top: -5px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
