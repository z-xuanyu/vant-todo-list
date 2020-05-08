<template>
  <div class="home">
    <!-- 导航 -->
    <van-nav-bar left-arrow :border="false" class="bg-color">
      <template slot="left">
        <div class="navbar-left">
          <van-icon size="21" color="#fff" name="arrow-left" />
          <span>清单</span>
        </div>
      </template>
      <template slot="right">
        <div class="navbar-right">
          <van-icon size="26" color="#fff" name="bulb-o" />
          <van-icon size="26" color="#fff" name="ellipsis" />
        </div>
      </template>
    </van-nav-bar>
    <!-- 时间 -->
    <div class="time-wrap">
      <h1>我的一天</h1>
      <div class="time">{{ dateTime }}</div>
    </div>
    <!-- 任务列表  -->
    <div class="list-wrap" ref="list">
      <!-- 下拉刷新 -->
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <!-- 列表组件上拉加载更多 -->
        <van-list
          v-model="loadingMore"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          v-if="this.list.length"
          offset="100"
        >
          <!-- item 组件 -->
          <item
            v-for="(item, index) in list"
            :key="index"
            :item="item"
            v-on:onDelete="onDelete(index)"
            v-on:onEdit="onEdit(item, index)"
            v-on:change="changCheck($event, index)"
            v-on:zIndex="zIndex($event, index)"
          ></item>
        </van-list>
      </van-pull-refresh>
    </div>
    <!-- 无任务状态 -->
    <div class="no-thing" v-if="!this.list.length">
      <van-icon name="question" />
      <span>你现在还没有任务哦！去添加一个吧！</span>
    </div>
    <!-- 添加新任务按钮 -->
    <div class="add" @click="handleAdd">
      <van-icon size="26" name="plus" />
      <span>添加任务</span>
    </div>
    <!-- 添加新任务弹出层组件 -->
    <van-popup position="bottom" round safe-area-inset-bottom v-model="addShow">
      <div class="add-content">
        <van-form @submit="onSubmit">
          <!-- 通过 pattern 进行正则校验 -->
          <van-field
            size="large"
            label-width="50"
            v-model="value1"
            label="任务："
            placeholder="请输入要添加新任务"
          />
          <div style="margin: 16px;">
            <van-button
              round
              :loading="loadding"
              block
              type="info"
              native-type="submit"
            >
              点击添加
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
    <!-- 编辑任务弹出层组件 -->
    <van-popup
      position="center"
      round
      safe-area-inset-bottom
      v-model="editShow"
    >
      <div class="edit-content">
        <van-form @submit="onSubmitEdit">
          <van-field
            size="large"
            label-width="60"
            label-class="edit-lebel"
            v-model="editText"
            label="任务："
          />
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit">
              点击保存
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>
<script>
import BScroll from "better-scroll"; //引入局部滚动插件
import Item from "../components/Item"; //引入封装任务列表item组件
import * as Utils from "../../utils/index"; //引入封装好的本地存储模块
import dayjs from "dayjs"; //引入时间格式化插件
export default {
  name: "Home",
  components: {
    Item,
  },
  data() {
    return {
      isLoading: false, //任务列表下拉刷新
      loadingMore: false, //上拉加载更多
      finished: true, //数据是否加载完成
      list: [], //数据列表
      addShow: false, //添加任务
      editShow: false, //编辑任务
      editText: "", //编辑内容
      editIndex: 0, //编辑当前index
      value1: "", //添加任务v-model绑定
      loadding: false, //加载按钮状态
    };
  },
  mounted() {
    // 获取数据
    this.getData();
    // better-scroll
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.list, {
        click: true,
      });
    });
  },
  methods: {
    // 显示添加任务组件
    handleAdd() {
      this.addShow = true;
    },
    // 提交添加任务数据
    onSubmit(values) {
      this.loadding = true;
      setTimeout(() => {
        this.loadding = false;
        this.addShow = false;
        let obj = {
          text: values.undefined,
          isfinished: false,
          isImportant: false,
        };
        this.list.push(obj);
        Utils.setItem("todoList", this.list);
        this.$toast.success("任务添加成功");
      }, 1000);
    },
    // 显示编辑任务组件
    onEdit(item, index) {
      this.editText = item.text;
      this.editShow = true;
      this.editIndex = index;
    },
    // 提交保存修改编辑内容数据
    onSubmitEdit(values) {
      this.editShow = false;
      this.$toast.success("任务修改成功");
      let obj = {
        text: values.undefined,
        isfinished: false,
        isImportant: false,
      };
      this.list.splice(this.editIndex, 1, obj);
      Utils.setItem("todoList", this.list);
    },
    // 任务是否已经完成
    changCheck($event, index) {
      this.list[index].isfinished = $event;
      Utils.setItem("todoList", this.list);
    },
    // 任务优先级
    zIndex($event, index) {
      this.list[index].isImportant = !$event;
      if (!$event) {
        this.$toast("已经标记为重要任务");
      } else {
        this.$toast("已经标记为普通任务");
      }
      Utils.setItem("todoList", this.list);
    },
    // 删除任务
    onDelete(index) {
      this.$dialog
        .confirm({
          message: "你确定要删除该任务吗？",
        })
        .then(() => {
          this.list.splice(index, 1);
          // 更新列表
          Utils.setItem("todoList", this.list);
        });
    },
    // 任务列表下拉刷新事件
    onRefresh() {
      this.finished = false;
      setTimeout(() => {
        this.isLoading = false;
        this.$toast("刷新成功");
        this.onLoad();
      }, 1000);
    },
    // 任务列表上拉刷新
    onLoad() {
      setTimeout(() => {
        let obj = {
          text: "分页加载的内容",
          isfinished: false,
          isImportant: false,
        };
        this.list.push(obj);
        Utils.setItem("todoList", this.list);

        this.finished = false;
      }, 1000);
      if (this.list.length >= 10) {
        this.finished = true;
      }
    },
    // 获取模拟数据
    getData() {
      this.$http("mock-api/list").then((res) => {
        console.log(res);
        Utils.getItem("todoList")
          ? (this.list = Utils.getItem("todoList"))
          : (this.list = []);
      });
    },
  },
  computed: {
    // 时间格式化
    dateTime() {
      return dayjs(new Date()).format("YYYY-MM-DD dddd");
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: url(../assets/bg.jpg) no-repeat center center/cover;
  .bg-color {
    background: transparent;
    color: #ffffff;
    .navbar-left {
      display: flex;
      align-items: center;
      span {
        font-size: 18px;
      }
    }
    .navbar-right {
      display: flex;
      align-items: center;
    }
  }
  .time-wrap {
    padding: 0 20px;
    color: #ffffff;
    h1 {
      font-size: 28px;
    }
    .time {
      font-size: 18px;
    }
  }
  .list-wrap {
    margin-top: 10px;
    padding: 20px;
    height: 380px;
    overflow: hidden;
  }
  .no-thing {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    font-size: 40px;
    color: blue;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 200px;
    left: 20px;
    right: 20px;
    span {
      margin-left: 10px;
      font-size: 14px;
      color: #000;
    }
  }
  .add {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 30px;
    margin: 0 20px;
    border-radius: 8px;
    height: 50px;
    color: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 20px;
    background-color: rgba(0, 0, 0, 0.4);
    span {
      margin-left: 10px;
      font-size: 22px;
    }
  }
  .add-content {
    padding: 10px;
  }
  .edit-content {
    padding: 20px;
    width: 80vw;
    /deep/ .edit-lebel {
      font-size: 16px;
    }
  }
}
</style>
