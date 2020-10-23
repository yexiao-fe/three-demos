declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

// 解决 Could not find a declaration file for module 报错
declare module '*.js'
