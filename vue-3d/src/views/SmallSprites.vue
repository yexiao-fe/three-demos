<template>
  <div class="small-sprites" ref="threeDom"></div>
</template>

<script lang="ts">
import Vue from "vue";
import * as THREE from "three/build/three.module.js";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import {
  CSS3DRenderer,
  CSS3DSprite,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";

import textImg from "../assets/img/sprite.png";

export default Vue.extend({
  data() {
    return {
      dom: "threeDom",
      particlesTotal: 512,
      positions: [],
      objects: [],
      current: 0,
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

      // 相机
      const camera: any = new THREE.PerspectiveCamera(
        75,
        currentDom.offsetWidth / currentDom.offsetHeight,
        1,
        5000
      );
      camera.position.set(600, 400, 1500);
      camera.lookAt(0, 0, 0);
      (this as any).camera = camera;

      // 渲染器
      const renderer = new CSS3DRenderer();
      renderer.setSize(currentDom.offsetWidth, currentDom.offsetHeight);
      currentDom.appendChild(renderer.domElement);
      (this as any).renderer = renderer;

      //控制器
      const controls = new TrackballControls(camera, renderer.domElement);
      (this as any).controls = controls;

      const image: any = document.createElement("img");
      image.addEventListener(
        "load",
        () => {
          for (let i = 0; i < this.particlesTotal; i++) {
            const object = new CSS3DSprite(image.cloneNode());
            (object.position.x = Math.random() * 4000 - 2000),
              (object.position.y = Math.random() * 4000 - 2000),
              (object.position.z = Math.random() * 4000 - 2000);
            scene.add(object);

            (this.objects as Array<any>).push(object);
          }

          this.transition();
        },
        false
      );
      image.src = textImg;

      this._plane();
      this._cube();
      this._random();
      this._sphere();

      window.addEventListener("resize", this.onWindowResize, false);
    },
    _sphere() {
      const radius = 750;

      for (let i = 0; i < this.particlesTotal; i++) {
        const phi = Math.acos(-1 + (2 * i) / this.particlesTotal);
        const theta = Math.sqrt(this.particlesTotal * Math.PI) * phi;

        (this.positions as Array<any>).push(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        );
      }
    },
    _random() {
      for (let i = 0; i < this.particlesTotal; i++) {
        (this.positions as Array<any>).push(
          Math.random() * 4000 - 2000,
          Math.random() * 4000 - 2000,
          Math.random() * 4000 - 2000
        );
      }
    },
    _cube() {
      const amount = 8;
      const separation = 150;
      const offset = ((amount - 1) * separation) / 2;

      for (let i = 0; i < this.particlesTotal; i++) {
        const x = (i % amount) * separation;
        const y = Math.floor((i / amount) % amount) * separation;
        const z = Math.floor(i / (amount * amount)) * separation;

        (this.positions as Array<any>).push(x - offset, y - offset, z - offset);
      }
    },
    _plane() {
      const amountX = 16;
      const amountZ = 32;
      const separation = 150;
      const offsetX = ((amountX - 1) * separation) / 2;
      const offsetZ = ((amountZ - 1) * separation) / 2;

      for (let i = 0; i < this.particlesTotal; i++) {
        const x = (i % amountX) * separation;
        const z = Math.floor(i / amountX) * separation;
        const y = (Math.sin(x * 0.5) + Math.sin(z * 0.5)) * 200;

        (this.positions as Array<any>).push(x - offsetX, y, z - offsetZ);
      }
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
    },
    transition() {
      const offset = this.current * this.particlesTotal * 3;
      const duration = 2000;

      for (let i = 0, j = offset; i < this.particlesTotal; i++, j += 3) {
        const object: any = this.objects[i];

        new TWEEN.Tween(object.position)
          .to(
            {
              x: this.positions[j],
              y: this.positions[j + 1],
              z: this.positions[j + 2],
            },
            Math.random() * duration + duration
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
      }

      new TWEEN.Tween(this)
        .to({}, duration * 3)
        .onComplete(this.transition)
        .start();

      this.current = (this.current + 1) % 4;
    },
    animate() {
      requestAnimationFrame((this as any).animate);

      TWEEN.update();
      (this as any).controls.update();

      const time = performance.now();

      for (let i = 0, l = this.objects.length; i < l; i++) {
        const object: any = this.objects[i];
        const scale =
          Math.sin((Math.floor(object.position.x) + time) * 0.002) * 0.3 + 1;
        object.scale.set(scale, scale, scale);
      }

      (this as any).renderer.render((this as any).scene, (this as any).camera);
    },
  },
});
</script>

<style lang="less" scoped>
.small-sprites {
  width: 100%;
  height: 100%;
}
</style>