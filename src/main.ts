import * as THREE from "three";
import { setup, update } from "./scene";

(async () => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
  );

  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // set styles of the canvas
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();

  const props = {
    scene,
    camera,
    renderer,
    clock,
    delta: 0,
    total: 0,
  };

  await setup(props);

  const animate = async () => {
    requestAnimationFrame(animate);

    props.delta = clock.getDelta();
    props.total = clock.getElapsedTime();

    await update(props);

    renderer.render(scene, camera);
  };

  animate();
})();
