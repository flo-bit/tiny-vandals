import * as THREE from "three";
import { setup, update } from "./scene";
import { createTinyVandalsWall, updateTinyVandalsWall } from "./pixi-app";

(async () => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
  );

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

  // add a cube to the threejs scene
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const cube = new THREE.Mesh(new THREE.PlaneGeometry(2, 1), material);
  cube.position.z = -2;
  scene.add(cube);

  const wall = await createTinyVandalsWall({});

  // set texture of the cube to be the pixijs canvas
  const texture = new THREE.CanvasTexture(wall.app.canvas);
  material.map = texture;

  await setup(props);

  const animate = async () => {
    requestAnimationFrame(animate);

    props.delta = clock.getDelta();
    props.total = clock.getElapsedTime();

    await update(props);
    await updateTinyVandalsWall(wall);

    // rotate the cube
    cube.rotation.y += props.delta;

    // render the scene
    renderer.render(scene, camera);

    // render the pixijs canvas
    wall.app.render();

    texture.needsUpdate = true;
  };

  let isPixi = true;
  // add event listener to window for keydown
  window.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      if (isPixi) {
        // switch between pixijs and threejs
        wall.app.canvas.style.display = "none";
        renderer.domElement.style.display = "block";
      } else {
        // switch between pixijs and threejs
        wall.app.canvas.style.display = "block";
        renderer.domElement.style.display = "none";
      }
      isPixi = !isPixi;
    }
  });

  animate();
})();
