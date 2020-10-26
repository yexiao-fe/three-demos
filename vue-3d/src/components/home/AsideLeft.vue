<template>
  <div class="aside-left">
    <div
      v-for="(item, index) in navList"
      :key="index"
      :class="{ active: active === item.name }"
      @click="selectName(item)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      active: "",
      navList: [
        { name: "元素周期表", path: "/PeriodicTable" },
        { name: "小精灵", path: "/SmallSprites" },
        { name: "分子结构", path: "/MolecularStructure" },
        { name: "test3", path: "/about" },
      ],
    };
  },
  methods: {
    selectName(item: any) {
      if (this.active === item.name) {
        this.active = "";
        this.$router.push("/");
      } else {
        this.active = item.name;
        this.$router.push(item.path);
      }
    },
  },
});
</script>

<style lang="less" scoped>
.aside-left {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  div {
    line-height: 40px;
    box-sizing: border-box;
    padding: 0 20px;

    &.active,
    &:hover {
      color: #42b983;
      background: rgba(255, 255, 255, 0.1);
      cursor: pointer;
    }
  }
}
</style>