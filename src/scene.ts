import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export type Props = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera; // Or another camera type if you prefer
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  delta: number;
  total: number;
};

// State for movement/looking
const keysPressed = { w: false, a: false, s: false, d: false };
let moveSpeed = 5.0;
let lookSpeed = 0.002;
let yaw = 0;
let pitch = 0;

// We'll store a reference to our loaded GLB model
let museumMap: THREE.Group | null = null;

// Simple bounding check (must stay within |x|<5, |z|<5)
function canMoveTo(x: number, z: number) {
  return Math.abs(x) < 9 && Math.abs(z) < 9;
}

let canvasTexture: THREE.CanvasTexture | null = null;

/**
 * Setup function: loads the GLB model, adds lights, sets up camera and controls
 */
export const setup = async ({ scene, camera, renderer, texture }: Props) => {
  // 1) Load the GLB model
  const loader = new GLTFLoader();
  try {
    const gltf = await loader.loadAsync("/tiny-vandals/map/MuseumMapV4.glb");
    museumMap = gltf.scene;

    console.log(museumMap);
    scene.add(museumMap);
    museumMap.children[0].material = new THREE.MeshStandardMaterial({
      color: 0xf1f1f1,
      side: THREE.DoubleSide,
    });

    // museumMap.children[0].visible = false;
    // material.map = texture;
    canvasTexture = new THREE.CanvasTexture(texture);
    museumMap.children[1].material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      map: canvasTexture,
    });

    // make everything double sided
    museumMap.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.side = THREE.DoubleSide;
      }
    });

    // Optional: scale or position your museum map if needed, for example:
    // museumMap.scale.set(1, 1, 1);
    // museumMap.position.set(0, 0, 0);
  } catch (err) {
    console.error("Failed to load MuseumMap.glb", err);
  }

  // 2) Basic lights (ambient + directional)
  scene.add(new THREE.AmbientLight(0xffffff, 0.01));
  // let directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
  // directionalLight.position.set(1, 0, 1);
  // scene.add(directionalLight);

  // 3) Create a spotlight that moves with the camera
  // Add the camera to the scene so children (spotlight) are rendered/moved properly
  scene.add(camera);
  camera.position.set(0, 10, 0);

  const spotLight = new THREE.SpotLight(0xffffff, 10, 0, 0.4, 0.5, 1);
  camera.add(spotLight);

  const spotLightTarget = new THREE.Object3D();
  spotLightTarget.position.set(0, 0, -10);
  camera.add(spotLightTarget);

  spotLight.target = spotLightTarget;
  spotLight.position.set(0, 0, 0);

  // 4) Set up the camera position & rotation order
  camera.position.set(0, 2, 0); // Starting position in the scene
  camera.rotation.order = "YXZ"; // Yaw -> Pitch -> Roll

  // 5) Set up controls (pointer lock + keyboard)
  setupPointerLock(renderer.domElement);
  setupKeyboardEvents();
};

/**
 * Pointer lock: allows us to capture the mouse movement to rotate the camera.
 */
function setupPointerLock(domElement: HTMLElement) {
  domElement.addEventListener("click", () => {
    domElement.requestPointerLock();
  });

  document.addEventListener(
    "pointerlockchange",
    () => {
      if (document.pointerLockElement === domElement) {
        document.addEventListener("mousemove", onMouseMove, false);
      } else {
        document.removeEventListener("mousemove", onMouseMove, false);
      }
    },
    false,
  );
}

/**
 * Mouse movement => update yaw/pitch
 */
function onMouseMove(event: MouseEvent) {
  yaw -= event.movementX * lookSpeed;
  pitch -= event.movementY * lookSpeed;
  const pitchLimit = Math.PI / 2 - 0.05;
  pitch = Math.max(-pitchLimit, Math.min(pitchLimit, pitch));
}

/**
 * WASD key handling
 */
function setupKeyboardEvents() {
  window.addEventListener("keydown", (e) => {
    switch (e.key.toLowerCase()) {
      case "w":
        keysPressed.w = true;
        break;
      case "a":
        keysPressed.a = true;
        break;
      case "s":
        keysPressed.s = true;
        break;
      case "d":
        keysPressed.d = true;
        break;
    }
  });
  window.addEventListener("keyup", (e) => {
    switch (e.key.toLowerCase()) {
      case "w":
        keysPressed.w = false;
        break;
      case "a":
        keysPressed.a = false;
        break;
      case "s":
        keysPressed.s = false;
        break;
      case "d":
        keysPressed.d = false;
        break;
    }
  });
}

/**
 * The update loop: called each frame. Moves the camera (WASD) and rotates it (mouse).
 */
export const update = async ({ camera, delta }: Props) => {
  // Apply yaw/pitch to camera
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;

  canvasTexture.needsUpdate = true;

  // Determine forward/back/strafe
  const forward = Number(keysPressed.w) - Number(keysPressed.s);
  const strafe = Number(keysPressed.a) - Number(keysPressed.d);

  if (forward !== 0 || strafe !== 0) {
    // Get camera's forward direction (ignore y so we don't fly)
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    // Create strafe vector
    const right = new THREE.Vector3();
    right.crossVectors(direction, camera.up).normalize().multiplyScalar(-1);

    // Combine movements
    let moveVector = new THREE.Vector3();
    moveVector.addScaledVector(direction, forward);
    moveVector.addScaledVector(right, strafe);
    moveVector.normalize();
    moveVector.multiplyScalar(moveSpeed * delta);

    // Calculate new camera position
    const newPosition = camera.position.clone().add(moveVector);

    // Check if movement is within bounding box
    if (canMoveTo(newPosition.x, newPosition.z)) {
      camera.position.copy(newPosition);
    }
  }
};
