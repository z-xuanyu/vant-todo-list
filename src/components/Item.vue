<template>
  <van-swipe-cell class="wrapper">
    <van-row class="content">
      <van-col span="3" class="content-left">
        <van-checkbox
          @change="changeCheck"
          icon-size="22"
          v-model="item.isfinished"
        ></van-checkbox>
      </van-col>
      <van-col span="17" class="content-midder">
        <div class="van-ellipsis" :class="item.isfinished ? 'finished' : ''">
          {{ item.text }}
        </div>
        <div class="sub-title">
          {{ item.isfinished ? "已经完成的任务" : "正在进行的任务" }}
        </div>
      </van-col>
      <van-col span="4" class="content-right">
        <van-icon
          :color="item.isImportant ? 'yellow' : ''"
          @click="onClick(item.isImportant)"
          size="22"
          name="star-o"
        />
      </van-col>
    </van-row>
    <template slot="right">
      <van-button @click="onEdit" square style="height:100%" type="primary">
        <van-icon size="22" name="edit" />
      </van-button>
      <van-button @click="onDelete" square style="height:100%" type="danger">
        <van-icon size="22" name="delete" />
      </van-button>
    </template>
  </van-swipe-cell>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
    },
  },
  methods: {
    // 删除
    onDelete() {
      this.$emit("onDelete");
    },
    // 编辑
    onEdit() {
      this.$emit("onEdit");
    },
    // 是否完成
    changeCheck(checked) {
      this.$emit("change", checked);
    },
    // 任务优先级
    onClick(isImportant) {
      this.$emit("zIndex", isImportant);
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  border-radius: 10px;
  margin-bottom: 10px;
  .content {
    height: 60px;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    .content-left {
      margin-left: 10px;
    }
    .content-midder {
      .finished {
        color: #ccc;
        text-decoration: line-through;
      }
      .sub-title {
        color: #aaaaaa;
        font-size: 14px;
      }
    }
    .content-right {
      text-align: center;
    }
  }
}
</style>
