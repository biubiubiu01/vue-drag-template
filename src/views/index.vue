<template>
  <div class="index-container">
    <div class="left-container">
      <div class="title">组件</div>
      <draggable
        class="component-list"
        :group="{ name: 'componentDrag', pull: 'clone' }"
        :sort="false"
        animation="300"
        draggable=".component-item"
        @end="handleEnd"
        v-model="comList"
        :clone="cloneComponent"
      >
        <div
          v-for="(element, index) in comList"
          :key="index"
          class="component-item"
        >
          <el-icon name="circle-plus-outline" class="icon"></el-icon
          >{{ element.title }}
        </div>
      </draggable>
      <el-button type="primary" @click="toNativePage">跳转到原生拖拽页面</el-button>
    </div>
    <div class="main-container">
      <draggable
        group="componentDrag"
        animation="400"
        v-model="drawList"
        ghostClass="ghost"
      >
        <div
          v-for="(com, index) in drawList"
          :key="index"
          :style="{ width: com.config.w + 'px', height: com.config.h + 'px' }"
        >
          <vue-drag-resize
            :x="parseFloat(com.config.x)"
            :y="parseFloat(com.config.y)"
            :w="parseFloat(com.config.w)"
            :h="parseFloat(com.config.h)"
            @resizestop="handleResizeStop($event, com.config)"
            @dragstop="handleDragStop($event, com.config)"
          >
            <component :is="com.componentName" />
          </vue-drag-resize>
        </div>
      </draggable>
      <div class="empty" v-if="drawList.length === 0">
        从左侧拖入或点选组件进行设计
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import vueDragResize from "vue-drag-resize";
import DragBox from "./components/dragBox.vue";
import dragCircle from "./components/dragCircle.vue";
export default {
  name: "Home",
  components: { draggable, DragBox, dragCircle, vueDragResize },
  data() {
    return {
      comList: [
        {
          title: "矩形盒子",
          componentName: "dragBox",
          id: "",
          config: {
            w: 150,
            h: 150,
            x: 0,
            y: 0,
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
            x: 0,
            y: 0,
            value: "",
          },
        },
      ],
      drawList: [],
      currentMove: {},
    };
  },
  methods: {
    //点击左侧拖动克隆当前盒子
    cloneComponent(e) {
      this.currentMove = {
        id: "box_" + new Date().getTime(),
        ...e,
      };
    },

    //拖动盒子到右边画布
    handleEnd(e) {
      this.drawList.push({
        ...this.currentMove,
      });
    },

    //拖动盒子自适应
    handleResizeStop(e, val) {
      val.w = e.width;
      val.h = e.height;
    },

    //拖拽移动停止
    handleDragStop(e, val) {
      val.x = e.left;
      val.t = e.top;
    },

    toNativePage(){
      this.$router.push({
        path:'/custom'
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.index-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;

  .left-container {
    width: 300px;
    height: 100%;
    box-sizing: border-box;
    padding: 25px;
    margin-left: 10%;
    .title {
      font-weight: bold;
    }
    .component-list {
      margin-top: 25px;
      .component-item {
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
  }
  .main-container {
    position: relative;
    flex: 1;
    margin-left: 5%;
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuXzAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjIuODA4OTg4NzY0MDQ0OTQwNSIgeT0iMC4wNTYxNzk3NzUyODA4OTU2OCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48cGF0aCBkPSJNIDEwIDAgSDAgTTAgMCBWMCAxMCIgc3Ryb2tlPSIjRTdFOEVBIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PHBhdHRlcm4gaWQ9InBhdHRlcm5fMSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iNDIuODA4OTg4NzY0MDQ0OTQiIHk9IjAuMDU2MTc5Nzc1MjgwODk1NjgiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PHBhdGggZD0iTSA1MCAwIEgwIE0wIDAgVjAgNTAiIHN0cm9rZT0iI0NCQ0VEMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm5fMCkiLz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm5fMSkiLz48L3N2Zz4=");

    &:before {
      width: 1px;
      position: absolute;
      top: 5%;
      bottom: 5%;
      left: -35px;
      background: #f1e8e8;
      content: "";
    }
    .empty {
      position: absolute;
      top: 46%;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 18px;
      color: #ccb1ea;
      letter-spacing: 4px;
    }

    .ghost {
      opacity: 0;
    }
  }
}
</style>
