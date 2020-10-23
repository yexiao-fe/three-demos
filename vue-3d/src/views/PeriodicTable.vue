<template>
  <div class="periodic-table">
    <div class="container" ref="threeDom"></div>
    <div id="menu">
      <button
        v-for="item in bList"
        :key="item"
        :ref="item"
        @click="checkButton(item)"
      >
        {{ item }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as THREE from "three/build/three.module.js";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { table } from "../assets/data";

export default Vue.extend({
  data() {
    return {
      dom: "threeDom",
      bList: ["table", "sphere", "helix", "grid"],
      objects: [],
      targets: { table: [], sphere: [], helix: [], grid: [] },
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
        40,
        currentDom.offsetWidth / currentDom.offsetHeight,
        1,
        10000
      );
      camera.position.z = 3000;
      (this as any).camera = camera;

      // 渲染器
      const renderer: any = new CSS3DRenderer();
      renderer.setSize(currentDom.offsetWidth, currentDom.offsetHeight);
      currentDom.appendChild(renderer.domElement);
      (this as any).renderer = renderer;

      // 控制器
      const controls = new TrackballControls(camera, renderer.domElement);
      controls.minDistance = 500;
      controls.maxDistance = 6000;
      controls.addEventListener("change", this.render);
      (this as any).controls = controls;

      // scene object
      this._sceneObject();
      this._table();
      this._sphere();
      this._helix();
      this._grid();

      this.transform(this.targets.table, 2000);
      window.addEventListener("resize", this.onWindowResize, false);
    },
    checkButton(name: string) {
      this.transform((this.targets as any)[name], 2000);
    },
    _sceneObject() {
      for (let i = 0; i < table.length; i += 5) {
        const element = document.createElement("div");
        element.className = "element";
        element.style.backgroundColor =
          "rgba(0,127,127," + (Math.random() * 0.5 + 0.25) + ")";

        const number = document.createElement("div");
        number.className = "number";
        number.textContent = String(i / 5 + 1);
        element.appendChild(number);

        const symbol = document.createElement("div");
        symbol.className = "symbol";
        symbol.textContent = table[i];
        element.appendChild(symbol);

        const details = document.createElement("div");
        details.className = "details";
        details.innerHTML = table[i + 1] + "<br>" + table[i + 2];
        element.appendChild(details);

        const object = new CSS3DObject(element);
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        (this as any).scene.add(object);

        (this.objects as Array<any>).push(object);
      }
    },
    _table() {
      for (let i = 0; i < table.length; i += 5) {
        const object = new THREE.Object3D();

        object.position.x = table[i + 3] * 140 - 1330;
        object.position.y = -(table[i + 4] * 180) + 990;

        (this.targets.table as Array<any>).push(object);
      }
    },

    _sphere() {
      const vector = new THREE.Vector3();

      for (let i = 0, l = this.objects.length; i < l; i++) {
        const phi = Math.acos(-1 + (2 * i) / l);
        const theta = Math.sqrt(l * Math.PI) * phi;

        const object = new THREE.Object3D();

        object.position.setFromSphericalCoords(800, phi, theta);

        vector.copy(object.position).multiplyScalar(2);

        object.lookAt(vector);

        (this.targets.sphere as Array<any>).push(object);
      }
    },

    _helix() {
      const vector = new THREE.Vector3();

      for (let i = 0, l = this.objects.length; i < l; i++) {
        const theta = i * 0.175 + Math.PI;
        const y = -(i * 8) + 450;

        const object = new THREE.Object3D();

        object.position.setFromCylindricalCoords(900, theta, y);

        vector.x = object.position.x * 2;
        vector.y = object.position.y;
        vector.z = object.position.z * 2;

        object.lookAt(vector);

        (this.targets.helix as Array<any>).push(object);
      }
    },

    _grid() {
      for (let i = 0; i < this.objects.length; i++) {
        const object = new THREE.Object3D();

        object.position.x = (i % 5) * 400 - 800;
        object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800;
        object.position.z = Math.floor(i / 25) * 1000 - 2000;

        (this.targets.grid as Array<any>).push(object);
      }
    },

    transform(targets: Array<any>, duration: number) {
      TWEEN.removeAll();

      for (let i = 0; i < this.objects.length; i++) {
        const object: any = this.objects[i];
        const target = targets[i];

        new TWEEN.Tween(object.position)
          .to(
            {
              x: target.position.x,
              y: target.position.y,
              z: target.position.z,
            },
            Math.random() * duration + duration
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();

        new TWEEN.Tween(object.rotation)
          .to(
            {
              x: target.rotation.x,
              y: target.rotation.y,
              z: target.rotation.z,
            },
            Math.random() * duration + duration
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
      }

      new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(this.render)
        .start();
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
      (this as any).render();
    },
    animate() {
      requestAnimationFrame((this as any).animate);
      TWEEN.update();
      (this as any).controls.update();
    },
    render() {
      (this as any).renderer.render((this as any).scene, (this as any).camera);
    },
  },
});
</script>

<style lang="less" scoped>
// @import "../assets/css/three.main.css";
.periodic-table {
  .container {
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
  }

  #menu {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%);
    z-index: 1;
  }
  .element {
    width: 120px;
    height: 160px;
    box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.5);
    border: 1px solid rgba(127, 255, 255, 0.25);
    font-family: Helvetica, sans-serif;
    text-align: center;
    line-height: normal;
    cursor: default;
  }

  .element:hover {
    box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.75);
    border: 1px solid rgba(127, 255, 255, 0.75);
  }

  .element .number {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 12px;
    color: rgba(127, 255, 255, 0.75);
  }

  .element .symbol {
    position: absolute;
    top: 40px;
    left: 0px;
    right: 0px;
    font-size: 60px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.75);
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
  }

  .element .details {
    position: absolute;
    bottom: 15px;
    left: 0px;
    right: 0px;
    font-size: 12px;
    color: rgba(127, 255, 255, 0.75);
  }

  button {
    color: rgba(127, 255, 255, 0.75);
    background: transparent;
    outline: 1px solid rgba(127, 255, 255, 0.75);
    border: 0px;
    padding: 5px 10px;
    cursor: pointer;
  }

  button:hover {
    background-color: rgba(0, 255, 255, 0.5);
  }

  button:active {
    color: #000000;
    background-color: rgba(0, 255, 255, 0.75);
  }
}
</style>