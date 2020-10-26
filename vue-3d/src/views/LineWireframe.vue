<template>
  <div class="line-wireframe" ref="threeDom">
    <div class="menu">
      <button
        v-for="item in select"
        :key="item.type"
        :class="{ active: item.type === selectActive }"
        @click="_selectWireframe(item)"
      >
        {{ item.name }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as THREE from "three/build/three.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { Wireframe } from "three/examples/jsm/lines/Wireframe.js";
import { WireframeGeometry2 } from "three/examples/jsm/lines/WireframeGeometry2.js";

export default Vue.extend({
  data() {
    return {
      dom: "threeDom",
      selectActive: "fat",
      select: [
        { name: "粗线", type: "fat" },
        { name: "细线", type: "thin" },
      ],
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
    _selectWireframe(item: any) {
      this.selectActive = item.type;
      const isFat = item.type === "fat";
      const pos = isFat ? { x: -40, y: 0, z: -5 } : { x: -150, y: 0, z: 145 };
      (this as any).camera.position.set(pos.x, pos.y, pos.z);

      (this as any).scene.children[0].visible = isFat ? true : false;
      (this as any).scene.children[1].visible = !isFat ? true : false;
    },
    init() {
      // 渲染容器
      const currentDom: any = this.$refs[this.dom];

      // 场景
      const scene: any = new THREE.Scene();
      (this as any).scene = scene;
      console.log(scene);

      // 相机
      const camera: any = new THREE.PerspectiveCamera(
        75,
        currentDom.offsetWidth / currentDom.offsetHeight,
        1,
        5000
      );
      camera.position.set(-40, 0, -5);
      (this as any).camera = camera;
      console.log(camera);

      // 渲染器
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setClearColor(0x000000, 0.0);
      renderer.setSize(currentDom.offsetWidth, currentDom.offsetHeight);
      currentDom.appendChild(renderer.domElement);
      (this as any).renderer = renderer;

      //控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.minDistance = 10;
      controls.maxDistance = 500;
      controls.addEventListener("change", this.render);
      (this as any).controls = controls;

      this._fatWireframe();
      this._wireframe();

      window.addEventListener("resize", this.onWindowResize, false);
      this.onWindowResize();
    },
    _wireframe() {
      const geometry = new THREE.SphereBufferGeometry(100, 32, 32);

      const wireframe = new THREE.WireframeGeometry(geometry);

      const line = new THREE.LineSegments(wireframe);
      line.material.depthTest = false;
      line.material.opacity = 0.25;
      line.material.transparent = true;
      line.visible = false;

      (this as any).scene.add(line);
    },
    _fatWireframe() {
      const geo = new THREE.IcosahedronBufferGeometry(20, 1);

      const geometry = new WireframeGeometry2(geo);

      const matLine = new LineMaterial({
        color: 0x00ff00,
        linewidth: 5, // in pixels
        //resolution:  // to be set by renderer, eventually
        dashed: false,
      });

      const wireframe = new Wireframe(geometry, matLine);
      wireframe.computeLineDistances();
      wireframe.scale.set(1, 1, 1);
      (this as any).scene.add(wireframe);
      (this as any).matLine = matLine;
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
      requestAnimationFrame((this as any).animate);
      (this as any).controls.update();
      // renderer will set this eventually
      //
      (this as any).matLine.resolution.set(
        window.innerWidth,
        window.innerHeight
      ); // resolution of the viewport 非常重要 否则线条会有问题
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

  .menu {
    position: absolute;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
    top: 0;
    z-index: 1;
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

  button:active,
  button.active {
    color: #000000;
    background-color: rgba(0, 255, 255, 0.75);
  }
}
</style>