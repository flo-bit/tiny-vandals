import * as THREE from "three";
import { Props } from "./types";

let icosphere: THREE.Mesh;

export const setup = async ({ scene }: Props) => {
  const geometry = new THREE.IcosahedronGeometry(1, 1);

  const material = new THREE.MeshStandardMaterial({
    color: 0x0077ff,
    flatShading: true,
  });

  icosphere = new THREE.Mesh(geometry, material);
  scene.add(icosphere);

  scene.add(new THREE.DirectionalLight());
};

export const update = async ({ delta }: Props) => {
  icosphere.rotation.x += delta;
  icosphere.rotation.y += delta;
};
