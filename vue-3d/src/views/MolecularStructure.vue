<template>
  <div class="molecular-structure">
    <div class="container" ref="threeDom"></div>
    <div class="topmenu">
      <button
        v-for="item in topMenu"
        :key="item.type"
        :class="{ active: item.type === topActive }"
        @click="_showAtomsOrBonds(item.type)"
      >
        {{ item.name }}
      </button>
    </div>
    <div class="menu">
      <button
        v-for="item in bottomMenu"
        :key="item.type"
        :title="item.title"
        :class="{ active: item.type === bottomActive }"
        @click="_selectMolecular(item)"
      >
        {{ item.name }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as THREE from "three/build/three.module.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { PDBLoader } from "three/examples/jsm/loaders/PDBLoader.js";
import {
  CSS3DRenderer,
  CSS3DObject,
  CSS3DSprite,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";

import textImg from "../assets/img/sprites/ball.png";
export default Vue.extend({
  data() {
    return {
      dom: "threeDom",
      topMenu: [
        { name: "原子", type: "Atoms" },
        { name: "结构", type: "Bonds" },
        { name: "原子 + 结构", type: "Atoms + Bonds" },
      ],
      topActive: "Atoms + Bonds",
      bottomMenu: [
        { name: "乙醇", type: "Ethanol", pdb: "ethanol.pdb" },
        {
          name: "苯甲酸",
          type: "Aspirin",
          pdb: "aspirin.pdb",
          title: "阿司匹林 | 乙酰氧基 | 乙酰水杨酸",
        },
        { name: "咖啡因", type: "Caffeine", pdb: "caffeine.pdb" },
        { name: "尼古丁", type: "Nicotine", pdb: "nicotine.pdb" },
        {
          name: "麦角二乙酰胺",
          type: "LSD",
          pdb: "lsd.pdb",
          title: "麦角酸二乙基酰胺 | D-麦角酸二乙胺 | 强烈的半人工致幻剂",
        },
        {
          name: "可卡因",
          type: "Cocaine",
          pdb: "cocaine.pdb",
          title: "古柯碱 | 苯甲基芽子碱",
        },
        {
          name: "胆固醇",
          type: "Cholesterol",
          pdb: "cholesterol.pdb",
          title: "胆甾醇 | 环戊烷多氢菲的衍生物",
        },
        { name: "番茄红素", type: "Lycopene", pdb: "lycopene.pdb" },
        { name: "葡萄糖", type: "Glucose", pdb: "glucose.pdb" },
        { name: "氧化铝", type: "Aluminium oxide", pdb: "Al2O3.pdb" },
        { name: "立方烷", type: "Cubane", pdb: "cubane.pdb" },
        { name: "铜", type: "Copper", pdb: "cu.pdb" },
        {
          name: "萤石",
          type: "Fluorite",
          pdb: "caf2.pdb",
          title: "氟石 | 氟化钙",
        },
        { name: "盐", type: "Salt", pdb: "nacl.pdb" },
        { name: "YBCO超导体", type: "YBCO superconductor", pdb: "ybco.pdb" },
        {
          name: "巴克球",
          type: "Buckyball",
          pdb: "buckyball.pdb",
          title: "一种继金刚石和石墨之后,碳元素的第三种晶体形态",
        },
        { name: "金刚石", type: "Diamond", pdb: "diamond.pdb" },
        { name: "石墨", type: "Graphite", pdb: "graphite.pdb" },
      ],
      bottomActive: "Ethanol",
      objects: [],
      colorSpriteMap: {},
    };
  },
  created() {
    (this as any).camera = null;
    (this as any).scene = null;
    (this as any).renderer = null;
    (this as any).controls = null;

    (this as any).tmpVec1 = new THREE.Vector3();
    (this as any).tmpVec2 = new THREE.Vector3();
    (this as any).tmpVec3 = new THREE.Vector3();
    (this as any).tmpVec4 = new THREE.Vector3();
    (this as any).offset = new THREE.Vector3();
    (this as any).loader = new PDBLoader();

    (this as any).loader = new PDBLoader();

    const baseSprite: any = document.createElement("img");
    baseSprite.src = textImg;

    (this as any).baseSprite = baseSprite;
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
      const root = new THREE.Object3D();
      scene.add(root);
      (this as any).root = root;
      (this as any).scene = scene;

      // 相机
      const camera: any = new THREE.PerspectiveCamera(
        75,
        currentDom.offsetWidth / currentDom.offsetHeight,
        1,
        5000
      );
      camera.position.z = 1000;
      (this as any).camera = camera;

      // 渲染器
      const renderer = new CSS3DRenderer();
      renderer.setSize(currentDom.offsetWidth, currentDom.offsetHeight);
      currentDom.appendChild(renderer.domElement);
      (this as any).renderer = renderer;

      //控制器
      const controls = new TrackballControls(camera, renderer.domElement);
      controls.rotateSpeed = 0.5;
      (this as any).controls = controls;

      (this as any).baseSprite.onload = () => {
        this.loadMolecule(
          `https://threejs.org/examples/models/pdb/${this.bottomMenu[0]["pdb"]}`
        );
      };

      window.addEventListener("resize", this.onWindowResize, false);
    },
    _selectMolecular(item: any) {
      this.bottomActive = item.type;
      this.loadMolecule(`https://threejs.org/examples/models/pdb/${item.pdb}`);
    },
    _showAtomsOrBonds(type: string) {
      this.topActive = type;
      const isJie = ["Atoms", "Atoms + Bonds"].includes(type);
      const isYuan = ["Bonds", "Atoms + Bonds"].includes(type);
      for (let i = 0; i < this.objects.length; i++) {
        const object: any = this.objects[i];

        if (object instanceof CSS3DSprite) {
          object.element.style.display = isJie ? "" : "none";
          object.visible = isJie ? true : false;
        } else {
          object.element.style.display = isYuan ? "" : "none";
          object.visible = isYuan ? true : false;
          if (!isYuan) return;
          const full = object.userData.bondLengthFull;
          const short = object.userData.bondLengthShort;
          object.element.style.height = type === "Bonds" ? full : short;
        }
      }
    },
    colorify(ctx: any, width: any, height: any, color: any) {
      const r = color.r,
        g = color.g,
        b = color.b;

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      for (let i = 0, l = data.length; i < l; i += 4) {
        data[i + 0] *= r;
        data[i + 1] *= g;
        data[i + 2] *= b;
      }

      ctx.putImageData(imageData, 0, 0);
    },
    imageToCanvas(image: any) {
      const width = image.width;
      const height = image.height;

      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const context: any = canvas.getContext("2d");
      context.drawImage(image, 0, 0, width, height);

      return canvas;
    },
    loadMolecule(url: string) {
      // 重置objects
      for (let i = 0; i < this.objects.length; i++) {
        const object: any = this.objects[i];
        if (object.parent) object.parent.remove(object);
      }
      this.objects = [];

      // 加载pdb
      (this as any).loader.load(url, (pdb: any) => {
        this._drawAtoms(pdb);
        this._drawBonds(pdb);
        // this._showAtomsOrBonds(this.topActive);
      });
    },
    _drawAtoms(pdb: any) {
      const geometryAtoms = pdb.geometryAtoms;
      const json = pdb.json;
      const offset = (this as any).offset;
      geometryAtoms.computeBoundingBox();
      geometryAtoms.boundingBox.getCenter(offset).negate();
      geometryAtoms.translate(offset.x, offset.y, offset.z);

      const positions = geometryAtoms.getAttribute("position");
      const colors = geometryAtoms.getAttribute("color");
      const position = new THREE.Vector3();
      const color = new THREE.Color();

      for (let i = 0; i < positions.count; i++) {
        position.x = positions.getX(i);
        position.y = positions.getY(i);
        position.z = positions.getZ(i);

        color.r = colors.getX(i);
        color.g = colors.getY(i);
        color.b = colors.getZ(i);

        const atom = json.atoms[i];
        const element = atom[4];

        if (!(this.colorSpriteMap as any)[element]) {
          const canvas = this.imageToCanvas((this as any).baseSprite);
          const context = canvas.getContext("2d");

          this.colorify(context, canvas.width, canvas.height, color);

          const dataUrl = canvas.toDataURL();

          (this.colorSpriteMap as any)[element] = dataUrl;
        }

        const colorSprite = (this.colorSpriteMap as any)[element];

        const atomitem: any = document.createElement("img");
        atomitem.src = colorSprite;

        const object: any = new CSS3DSprite(atomitem);
        object.position.copy(position);
        object.position.multiplyScalar(75);

        object.matrixAutoUpdate = false;
        object.updateMatrix();

        (this as any).root.add(object);

        (this.objects as Array<any>).push(object);
      }
    },
    _drawBonds(pdb: any) {
      const geometryBonds = pdb.geometryBonds;
      const json = pdb.json;
      const offset = (this as any).offset;
      geometryBonds.translate(offset.x, offset.y, offset.z);

      const positions: any = geometryBonds.getAttribute("position");
      const start = new THREE.Vector3();
      const end = new THREE.Vector3();

      for (let i = 0; i < positions.count; i += 2) {
        start.x = positions.getX(i);
        start.y = positions.getY(i);
        start.z = positions.getZ(i);

        end.x = positions.getX(i + 1);
        end.y = positions.getY(i + 1);
        end.z = positions.getZ(i + 1);

        start.multiplyScalar(75);
        end.multiplyScalar(75);

        (this as any).tmpVec1.subVectors(end, start);
        const bondLength = (this as any).tmpVec1.length() - 50;

        //

        const bond = document.createElement("div");
        bond.className = "bond";
        bond.style.height = bondLength + "px";

        const object = new CSS3DObject(bond);
        object.position.copy(start);
        object.position.lerp(end, 0.5);

        object.userData.bondLengthShort = bondLength + "px";
        object.userData.bondLengthFull = bondLength + 55 + "px";

        //

        const axis = (this as any).tmpVec2
          .set(0, 1, 0)
          .cross((this as any).tmpVec1);
        const radians = Math.acos(
          (this as any).tmpVec3
            .set(0, 1, 0)
            .dot((this as any).tmpVec4.copy((this as any).tmpVec1).normalize())
        );

        const objMatrix = new THREE.Matrix4().makeRotationAxis(
          axis.normalize(),
          radians
        );
        object.matrix = objMatrix;
        object.quaternion.setFromRotationMatrix(object.matrix);

        object.matrixAutoUpdate = false;
        object.updateMatrix();

        (this as any).root.add(object);

        (this.objects as Array<any>).push(object);

        //

        const bond2: any = document.createElement("div");
        bond2.className = "bond";
        bond2.style.height = bondLength + "px";

        const joint = new THREE.Object3D(bond2);
        joint.position.copy(start);
        joint.position.lerp(end, 0.5);

        joint.matrix.copy(objMatrix);
        joint.quaternion.setFromRotationMatrix(joint.matrix);

        joint.matrixAutoUpdate = false;
        joint.updateMatrix();

        const object2 = new CSS3DObject(bond2);
        object2.rotation.y = Math.PI / 2;

        object2.matrixAutoUpdate = false;
        object2.updateMatrix();

        object2.userData.bondLengthShort = bondLength + "px";
        object2.userData.bondLengthFull = bondLength + 55 + "px";

        object2.userData.joint = joint;

        joint.add(object2);
        (this as any).root.add(joint);

        (this.objects as Array<any>).push(object2);
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
    animate() {
      requestAnimationFrame(this.animate);
      (this as any).controls.update();

      const time = Date.now() * 0.0004;

      (this as any).root.rotation.x = time;
      (this as any).root.rotation.y = time * 0.7;

      this.render();
    },
    render() {
      (this as any).renderer.render((this as any).scene, (this as any).camera);
    },
  },
});
</script>

<style lang="less" scoped>
// @import "../assets/css/three.main.css";
.molecular-structure {
  height: 100%;
  position: relative;

  .container {
    height: 100%;
  }

  .topmenu,
  .menu {
    position: absolute;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
  }

  .topmenu {
    top: 0;
  }

  .menu {
    bottom: 0;
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

  /deep/ .bond {
    width: 5px;
    height: 10px;
    background: #999;
    display: block;
  }
}
</style>