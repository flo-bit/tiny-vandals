import * as THREE from "three";
import { setup, update } from "./scene";
import { createTinyVandalsWall, updateTinyVandalsWall } from "./pixi-app";
import { Props } from "./types";
import Stats from "stats.js";
import { showEndcard } from "./endcard";

(async () => {
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

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

    const props: Props = {
        scene,
        camera,
        renderer,
        clock,
        delta: 0,
        total: 0,
        texture: null,
    };

    const wall = await createTinyVandalsWall({});

    props.texture = wall.app.canvas;

    // // set texture of the cube to be the pixijs canvas
    // const texture = new THREE.CanvasTexture(wall.app.canvas);
    // material.map = texture;

    await setup(props);
    renderer.outputColorSpace = THREE.SRGBColorSpace; // optional with post-processing
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const animate = async () => {
        stats.begin();

        props.delta = clock.getDelta();
        props.total = clock.getElapsedTime();

        // render the pixijs canvas
        wall.app.render();

        await update(props);
        await updateTinyVandalsWall(wall);

        // render the scene
        renderer.render(scene, camera);

        // texture.needsUpdate = true;

        stats.end();

        requestAnimationFrame(animate);
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

setTimeout(() => {
    showEndcard({
        paintings: [
            {
                name: "The Starry Night",
                damages: 1000000,
            },
        ],
    });
}, 1000);
