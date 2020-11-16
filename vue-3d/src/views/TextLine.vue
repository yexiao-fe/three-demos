<template>
  <div class="line-wireframe" ref="threeDom"></div>
</template>

<script lang="ts">
import Vue from "vue";
import * as THREE from "three/build/three.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

      // 相机
      const camera: any = new THREE.PerspectiveCamera(
        75,
        currentDom.offsetWidth / currentDom.offsetHeight,
        1,
        5000
      );
      camera.position.set(17.617, 6.794, 499.643);
      camera.rotation.set(-0.013, 0.035, 0);
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
      this._createText();
      window.addEventListener("resize", this.onWindowResize, false);
      this.onWindowResize();
    },
    _createText() {
      const loader = new THREE.FontLoader();
      loader.load("helvetiker_regular.typeface.json", (font: any) => {
        const color = 0x006699;

        const matDark = new THREE.LineBasicMaterial({
          color: color,
          side: THREE.DoubleSide,
        });

        const matLite = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide,
        });

        const message = "   Three.js\nSimple text.";

        const shapes = font.generateShapes(message, 100);

        const geometry = new THREE.ShapeBufferGeometry(shapes);

        geometry.computeBoundingBox();

        const xMid =
          -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

        geometry.translate(xMid, 0, 0);

        // make shape ( N.B. edge view not visible )

        const text = new THREE.Mesh(geometry, matLite);
        text.position.z = -150;
        (this as any).scene.add(text);

        // make line shape ( N.B. edge view remains visible )

        const holeShapes = [];

        for (let i = 0; i < shapes.length; i++) {
          const shape = shapes[i];

          if (shape.holes && shape.holes.length > 0) {
            for (let j = 0; j < shape.holes.length; j++) {
              const hole = shape.holes[j];
              holeShapes.push(hole);
            }
          }
        }

        shapes.push.apply(shapes, ...holeShapes);

        const lineText = new THREE.Object3D();

        for (let i = 0; i < shapes.length; i++) {
          const shape = shapes[i];

          const points = shape.getPoints();
          const geometry = new THREE.BufferGeometry().setFromPoints(points);

          geometry.translate(xMid, 0, 0);

          const lineMesh = new THREE.Line(geometry, matDark);
          lineText.add(lineMesh);
        }
        (this as any).scene.add(lineText);
        this.animate()
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