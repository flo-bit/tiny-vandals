import { Application, Assets, Renderer, Sprite } from "pixi.js";

const bunnyTexture = await Assets.load("/images/spider.png");
const paintingTextures = [
    await Assets.load("/images/painting01.png"),
    await Assets.load("/images/painting02.png"),
    await Assets.load("/images/painting03.png"),
];

type Painting = {
    damage: number,
    sprite: Sprite,
};

type Enemy = {
    sprite: Sprite,
    x: number,
    y: number,
};

type TinyVandalsWall = {
    app: Application<Renderer>,
    paintings: unknown[],
    enemies: Enemy[],
    width: number,
    height: number,
};

export async function createTinyVandalsWall({ width = 1024, height = 512 }: { width?: number, height?: number }): Promise<TinyVandalsWall> {
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
        bunny.scale.set(1);

        // Move the sprite to the center of the screen
        bunny.x = enemy.x;
        bunny.y = enemy.y;
        enemies.push(enemy);
    }

    const paintings: Painting[] = [];
    for (let index = 0; index < 3; index++) {
        // Create a new Sprite from an image path
        const sprite = new Sprite(paintingTextures[index]);

        // Add to stage
        app.stage.addChild(sprite);
        const painting = {
            damage: 0,
            sprite,
        };

        // Center the sprite's anchor point
        sprite.anchor.set(0.5);
        sprite.scale.set(1);

        // Move the sprite to the center of the screen
        sprite.x = width / 4 + 50;
        sprite.y = height / 2;
        paintings.push(painting);
    }

    return {
        app,
        paintings,
        enemies,
        width,
        height,
    };
}

export async function updateTinyVandalsWall(app: TinyVandalsWall) {
    for (const enemy of app.enemies) {
        enemy.x += (Math.random() - 0.5) * 20;
        enemy.y += (Math.random() - 0.5) * 20;
        enemy.x = Math.max(0, Math.min(app.width, enemy.x));
        enemy.y = Math.max(0, Math.min(app.height, enemy.y));
        enemy.sprite.x = enemy.x;
        enemy.sprite.y = enemy.y;
    }
}
