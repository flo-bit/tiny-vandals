import { Application, Assets, Renderer, Sprite } from "pixi.js";

const bunnyTexture = await Assets.load("https://pixijs.com/assets/bunny.png");

type TinyVandalsWall = {
    app: Application<Renderer>,
    paintings: unknown[],
    enemies: {
        x: number,
        y: number,
        sprite: Sprite,
    }[],
};

export async function createTinyVandalsWall({width = 1024, height = 1024}: {width?: number, height?: number}): Promise<TinyVandalsWall> {
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
    const enemy = {
        x: 0,
        y: 0,
        sprite: bunny,
    };

    // Center the sprite's anchor point
    bunny.anchor.set(0.5);
    bunny.scale.set(10);

    // Move the sprite to the center of the screen
    bunny.x = enemy.x;
    bunny.y = enemy.y;

    return {
        app,
        paintings: [],
        enemies: [
            enemy,
        ],
    };
}

export async function updateTinyVandalsWall(app: TinyVandalsWall) {
    for (const enemy of app.enemies) {
        enemy.x += 1;
        enemy.y += 1;
        enemy.sprite.x = enemy.x;
        enemy.sprite.y = enemy.y;
    }
}
