import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

let camera, scene, renderer, mixer, mainModel;
const clock = new THREE.Clock();
let control;

init();
animate();

function init() {
  const canvas = document.querySelector("#threejs-canvas");

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    5000
  );
  //init view1 -- look front

  camera.position.set(
    0.9065422953271847,
    121.98530006394886,
    54.86043616712843
  );
  // camera.lookAt(0, 140, 0);

  // window.camera = camera;

  scene = new THREE.Scene();

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  hemiLight.position.set(0, 200, 100);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  // dirLight.position.set(1000, 1000, 1000);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 180;
  dirLight.shadow.camera.bottom = -100;
  dirLight.shadow.camera.left = -120;
  dirLight.shadow.camera.right = 120;
  scene.add(dirLight);

  // scene.add(new THREE.CameraHelper(dirLight.shadow.camera));

  // model
  const loader = new FBXLoader();
  loader.load(
    "./model/girl.fbx",
    (object) => {
      mixer = new THREE.AnimationMixer(object);

      const action = mixer.clipAction(object.animations[0]);
      action.play();

      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.transparent = false;
          // console.log(child);
          // child.material.alphaTest = 0;
        }
      });

      object.position.set(0, 0, 0);
      scene.add(object);
      mainModel = object;
    },
    (xhr) => {
      if (xhr.loaded / xhr.total === 1) {
        introAnimation();
      }
    }
  );

  // scene.add(new THREE.AxesHelper(500));

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  control = new OrbitControls(camera, renderer.domElement);
  control.enabled = false;
  control.target.set(0, 145, 0);

  // control.addEventListener("change", (event) => {
  //   console.log(control.object.position);
  //   console.log(control.target);
  // });

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (mixer) mixer.update(delta);
  if (control) control.update();

  renderer.render(scene, camera);
}

function introAnimation() {
  const introTL = gsap.timeline();
  introTL.to(".loader", {
    x: "150%",
    duration: 1.5,
    ease: "power4.inOut",
    onComplete: textAnimation,
  });
}
function textAnimation() {
  //text - from top to center 20%
  gsap.to(".background", {
    opacity: 1,
    top: "10%",
    duration: 1,
    onComplete: scrollAnimation,
  });
}
function scrollAnimation() {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.defaults({
    immediateRender: false,
    ease: "power1.inOut",
    scrub: true,
    // markers: true,
  });

  //-----------------------
  //mesh animation

  //view2 -- look at right -- zoom out
  gsap.to(mainModel.rotation, {
    x: 0,
    y: (Math.PI * 2) / 3,
    z: 0,
    scrollTrigger: {
      trigger: ".section-two",
      start: "top center",
      end: "bottom center",
    },
  });
  gsap.to(camera.position, {
    x: -7.583551859281733,
    y: 100.06093684850975,
    z: 73.36027037638635,
    scrollTrigger: {
      trigger: ".section-two",
      start: "top center",
      end: "bottom center",
    },
  });
  gsap.to(control.target, {
    x: 1.4292862142606573,
    y: 139.79754593337526,
    z: -54.039389573588004,

    scrollTrigger: {
      trigger: ".section-two",
      start: "top center",
      end: "bottom center",
    },
  });

  //view 3 -- look at left -- zoom out
  gsap.to(mainModel.rotation, {
    x: 0,
    y: (Math.PI * 4) / 3,
    z: 0,
    scrollTrigger: {
      trigger: ".section-three",
      start: "top center",
      end: "bottom center",
    },
  });
  gsap.to(camera.position, {
    x: -13.528508815882114,
    y: 62.022334783870534,
    z: 142.06754721491404,
    scrollTrigger: {
      trigger: ".section-three",
      start: "top center",
      end: "bottom center",
    },
  });
  gsap.to(control.target, {
    x: 3.2492855338505695,
    y: 137.48598549606092,
    z: -55.58030638045425,
    scrollTrigger: {
      trigger: ".section-three",
      start: "top center",
      end: "bottom center",
    },
  });

  //view4 -- look front -- zoom out
  gsap.to(mainModel.rotation, {
    x: 0,
    y: Math.PI * 2,
    z: 0,
    scrollTrigger: {
      trigger: ".section-four",
      start: "top center",
      end: "bottom center",
    },
  });
  gsap.to(camera.position, {
    x: -2.1624490642216077,
    y: 85.00866666062727,
    z: 263.72096354136363,
    scrollTrigger: {
      trigger: ".section-four",
      start: "top center",
      end: "bottom center",
    },
  });
  gsap.to(control.target, {
    x: 0.19388100545095913,
    y: 88.83679787401333,
    z: -24.954186106606883,

    scrollTrigger: {
      trigger: ".section-four",
      start: "top center",
      end: "bottom center",
    },
  });

  //----------------------
  // html-css animation
  gsap.to(".background", {
    opacity: 0,
    scrollTrigger: {
      trigger: ".section-two",
      start: "top center",
      end: "bottom center",
    },
  });

  gsap.to(".sticky-text", {
    opacity: 1,
    scrollTrigger: {
      trigger: ".section-two",
      start: "top 30%",
      // end: "top 20%",
    },
  });

  gsap.to(".sticky-text2", {
    opacity: 1,
    scrollTrigger: {
      trigger: ".section-three",
      start: "top top",
      end: "bottom top",
    },
  });
}
