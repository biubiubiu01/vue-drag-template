<template>
  <div class="drag-page">
    <div class="drag-header"></div>
    <div class="drag-main">
      <div class="drag-component" @dragstart="handleDragStart">
        <div
          class="drag-component-item"
          draggable
          :data-index="index"
          v-for="(item, index) in componentList"
          :key="index"
        >
          <el-icon name="circle-plus-outline" class="icon"></el-icon
          >{{ item.title }}
        </div>
      </div>
      <div
        class="drag-canvas"
        id="dragCanvas"
        @drop="handleDropEnd"
        @dragover="handleDragOver"
      >
        <drag-grid :width="1600" :height="860" :needLine="true">
          <drag-item
            v-for="com in drawList"
            :key="com.id"
            :w.sync="com.config.w"
            :h.sync="com.config.h"
            :x.sync="com.config.x"
            :y.sync="com.config.y"
          >
            <component :is="com.componentName" v-bind="com.config" />
          </drag-item>
        </drag-grid>
      </div>
    </div>
  </div>
</template>

<script>
import DragGrid from "@/components/drag/dragGrid";
import DragItem from "@/components/drag/dragItem";
import DragBox from "./components/dragBox.vue";
import dragCircle from "./components/dragCircle.vue";
export default {
  components: { DragGrid, DragItem, DragBox, dragCircle },
  data() {
    return {
      componentList: [
        {
          title: "矩形盒子",
          componentName: "dragBox",
          id: "",
          config: {
            w: 150,
            h: 150,
            x: "",
            y: "",
            value: "",
          },
        },
        {
          title: "圆形盒子",
          componentName: "dragCircle",
          id: "",
          config: {
            w: 150,
            h: 150,
            x: "",
            y: "",
            value: "",
          },
        },
      ],
      drawList: [],
      currentIndex: null,
    };
  },
  computed: {
    getStyle() {
      return (com) => {
        return {
          width: com.w + "px",
          height: com.h + "px",
          left: com.x + "px",
          top: com.y + "px",
          position: "absolute",
        };
      };
    },
  },
  created() {},
  mounted() {},
  methods: {
    handleDragStart(event) {
      this.currentIndex = event.target.dataset.index;
    },

    //拖动结束
    handleDropEnd(e) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.clearData();
      const index = this.currentIndex;
      const rectInfo = document
        .getElementById("dragCanvas")
        .getBoundingClientRect();
      if (index || index === 0) {
        const component = JSON.parse(JSON.stringify(this.componentList[index]));
        component.config.y = e.clientY - rectInfo.y;
        component.config.x = e.clientX - rectInfo.x;
        component.id = "box_" + new Date().getTime();
        this.drawList.push({ ...component });
      }
    },

    //移动中
    handleDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },
  },
};
</script>
<style lang="scss" scoped>
.drag-page {
  height: 100vh;
  width: 100%;
  position: relative;
  .drag-header {
    height: 50px;
    line-height: 50px;
    width: 100%;
    background: rgb(250, 251, 252);
  }
  .drag-main {
    display: flex;
    width: 100%;
    height: calc(100% - 50px);
    border-top: 1px solid #dcdfe6;
    box-sizing: border-box;

    .drag-component {
      height: 100%;
      width: 250px;
      background: rgb(250, 251, 252);
      box-sizing: border-box;
      border-right: 1px solid #dcdfe6;
      padding: 15px;
      .drag-component-item {
        margin-bottom: 15px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        color: #606266;
        padding: 0 15px;
        height: 40px;
        line-height: 40px;
        cursor: move;
        &:hover {
          border-style: dashed;
        }
        .icon {
          margin-right: 8px;
        }
      }
    }
    .drag-canvas {
      position: relative;
      overflow: auto;
      flex: 1;
      box-sizing: border-box;
      margin: 25px;
    }
    // .drag-setting {
    //   width: 300px;
    //   height: 100%;
    //   background: rgb(250, 251, 252);
    //   box-sizing: border-box;
    //   border-left: 1px solid #dcdfe6;
    // }
  }
}
</style>
