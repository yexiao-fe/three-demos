<template>
  <div id="app">
    <div id="header">
      <header-top></header-top>
    </div>
    <div id="aside">
      <aside-left></aside-left>
    </div>
    <div id="container">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HeaderTop from "./components/home/HeaderTop.vue";
import AsideLeft from "./components/home/AsideLeft.vue";

export default Vue.extend({
  components: {
    HeaderTop,
    AsideLeft,
  },
});
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  font-size: 14px;
  width: 100vw;
  height: 100vh;
  --bg: #2c3e50;

  #header {
    height: 60px;
    line-height: 60px;
    background-color: var(--bg);
  }

  #aside,
  #container {
    height: calc(100% - 60px);
    float: left;
    box-sizing: border-box;
    overflow: hidden;
  }

  #aside {
    width: 220px;
    border-top: 1px solid #596571;
    background-color: var(--bg);
  }

  #container {
    width: calc(100% - 220px);
    padding: 20px;
    background: radial-gradient(transparent,#596571);

    &>div{
      position: relative;
      height: 100%;
    }
  }
}
</style>
