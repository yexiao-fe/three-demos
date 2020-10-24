<template>
  <div class="header-top">
    <div class="title">{{ title }}</div>
    <div class="date">
      <span>{{ date }} </span>
      <span>{{ times }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      title: "三维可视化",
      date: "",
      times: "",
    };
  },
  created() {
    if ((this as any).timer) clearInterval((this as any).timer);
    (this as any).timer = null;
    (this as any).timer = setInterval((this as any).setTime, 1000);
  },
  methods: {
    setTime(): void {
      const date: any = new Date();
      const year: number = date.getFullYear();
      const mon: number = date.getMonth();
      const day: number = date.getDate();
      const hour: number = date.getHours();
      const min: number = date.getMinutes();
      const sec: number = date.getSeconds();
      (this as any).date = `${year}-${
        mon < 9 ? "0" + String(mon + 1) : String(mon + 1)
      }-${day < 10 ? "0" + String(day) : String(day)}`;
      (this as any).times = `${hour < 10 ? "0" + String(hour) : String(hour)}:${
        min < 10 ? "0" + String(min) : String(min)
      }:${sec < 10 ? "0" + String(sec) : String(sec)}`;
    },
    beforeDestroy(): void {
      if ((this as any).timer) clearInterval((this as any).timer);
    },
  },
});
</script>

<style lang="less" scoped>
.header-top {
  height: 100%;
  position: relative;

  .title {
    width: 220px;
    text-align: center;
    position: absolute;
    left: 0;
    font-style: oblique;
    font-size: 24px;
  }

  .date {
    position: absolute;
    right: 20px;
    font-size: 16px;

    span:last-child {
      font-size: 20px;
      color: #f8d305;
    }
  }
}
</style>