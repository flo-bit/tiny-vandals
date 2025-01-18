import { Application, Assets, Sprite } from "pixi.js";

const bunnyTexture = await Assets.load("https://pixijs.com/assets/bunny.png");

export async function createTinyVandalsApp({width = 1024, height = 1024}: {width?: number, height?: number}) {
    // Create a PixiJS application.
    const app = new Application();

    // Intialize the application.
    await app.init({
        width,
        height,
        background: "#ff99bb",
    });

    document.body.appendChild(app.canvas);

    // Create a new Sprite from an image path
    const bunny = new Sprite(bunnyTexture);

    // Add to stage
    app.stage.addChild(bunny);

    // Center the sprite's anchor point
    bunny.anchor.set(0.5);
    bunny.scale.set(10);

    // Move the sprite to the center of the screen
    bunny.x = 0;
    bunny.y = 0;

    return app;
}
