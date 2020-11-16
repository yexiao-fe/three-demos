<template>
  <div class="line-wireframe" ref="threeDom"></div>
</template>

<script lang="ts">
import Vue from "vue";
import * as THREE from "three/build/three.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import timg from "../assets/img/earth.jpg";

export default Vue.extend({
  data() {
    return {
      dom: "threeDom",
    };
  },
  created() {
    (this as any).camera = null;
    (this as any).scene = null;
    (this as any).renderer = null;
    (this as any).controls = null;
  },
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      // 渲染容器
      const currentDom: any = this.$refs[this.dom];

      // 场景
      const scene: any = new THREE.Scene();
      (this as any).scene = scene;
      console.log(scene, "*******************scene");

      // 相机
      const camera: any = new THREE.PerspectiveCamera(
        75,
        currentDom.offsetWidth / currentDom.offsetHeight,
        1,
        5000
      );
      camera.position.set(1.46, 6.771, -7.212);
      camera.rotation.set(-2.388, 0.147, 3.005);
      (this as any).camera = camera;

      // 渲染器
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setClearColor(0x000000, 0.0);
      renderer.setSize(currentDom.offsetWidth, currentDom.offsetHeight);
      currentDom.appendChild(renderer.domElement);
      (this as any).renderer = renderer;

      const light = new THREE.AmbientLight(0xffffff); // soft white light
      scene.add(light);

      //控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.minDistance = 10;
      controls.maxDistance = 500;
      controls.addEventListener("change", this.render);
      (this as any).controls = controls;
      this._earth();
      window.addEventListener("resize", this.onWindowResize, false);
      this.onWindowResize();
    },
    _earth() {
      const geometry = new THREE.SphereBufferGeometry(5, 32, 32);
      const loader = new THREE.TextureLoader();

      loader.load(timg, (texture: any) => {
        const material = new THREE.MeshStandardMaterial({
          emissive: 0x000,
          emissiveMap: texture,
          map: texture,
        });

        const sphere = new THREE.Mesh(geometry, material);
        (this as any).scene.add(sphere);
        this.animate();
      });
    },
    onWindowResize() {
      const currentDom: any = this.$refs[this.dom];
      (this as any).camera.aspect =
        currentDom.offsetWidth / currentDom.offsetHeight;
      (this as any).camera.updateProjectionMatrix();

      (this as any).renderer.setSize(
        currentDom.offsetWidth,
        currentDom.offsetHeight
      );

      this.render();
    },
    animate() {
      //   requestAnimationFrame((this as any).animate);
      (this as any).controls.update();
      this.render();
    },
    render() {
      (this as any).renderer.render((this as any).scene, (this as any).camera);
    },
  },
});
</script>

<style lang="less" scoped>
.line-wireframe {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>