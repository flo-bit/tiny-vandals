import * as THREE from "three";
import { Props } from "./types";

let icosphere: THREE.Mesh;

export const setup = async ({ scene }: Props) => {
  const geometry = new THREE.BoxGeometry(10, 2, 10);

  const material = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    flatShading: true,
    side: THREE.DoubleSide,
  });

  icosphere = new THREE.Mesh(geometry, material);
  scene.add(icosphere);

  // add point light
  scene.add(new THREE.PointLight(0xffffff, 4, 100));
};

export const update = async ({ delta }: Props) => {
  icosphere.rotation.y += delta;
};
