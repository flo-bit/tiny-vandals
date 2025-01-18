import * as THREE from "three";

export type Props = {
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    clock: THREE.Clock;
    delta: number;
    total: number;
    texture: HTMLCanvasElement | null;
};
