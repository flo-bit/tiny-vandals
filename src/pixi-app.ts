import { Application, Assets, Renderer, Sprite } from "pixi.js";

const bunnyTexture = await Assets.load("https://pixijs.com/assets/bunny.png");

type Enemy = {
    sprite: Sprite,
    x: number,
    y: number,
};

type TinyVandalsWall = {
    app: Application<Renderer>,
    paintings: unknown[],
    enemies: Enemy[],
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

    const enemies: Enemy[] = [];

    for (let index = 0; index < 4; index++) {
        // Create a new Sprite from an image path
        const bunny = new Sprite(bunnyTexture);

        // Add to stage
        app.stage.addChild(bunny);
        const enemy = {
            x: width / 2,
            y: height / 2,
            sprite: bunny,
        };

        // Center the sprite's anchor point
        bunny.anchor.set(0.5);
        bunny.scale.set(10);

        // Move the sprite to the center of the screen
        bunny.x = enemy.x;
        bunny.y = enemy.y;
        enemies.push(enemy);
    }

    return {
        app,
        paintings: [],
        enemies,
    };
}

export async function updateTinyVandalsWall(app: TinyVandalsWall) {
    for (const enemy of app.enemies) {
        enemy.x += (Math.random() - 0.5) * 20;
        enemy.y += (Math.random() - 0.5) * 20;
        enemy.sprite.x = enemy.x;
        enemy.sprite.y = enemy.y;
    }
}
