import {
    Application,
    Assets,
    Graphics,
    Container,
    Renderer,
    Sprite,
} from "pixi.js";

const spiderTexture = await Assets.load("/tiny-vandals/images/Monster1.png");
const paintingTextures = [
    await Assets.load("/tiny-vandals/images/painting01.png"),
    await Assets.load("/tiny-vandals/images/painting02.png"),
    await Assets.load("/tiny-vandals/images/painting03.png"),
];

type Painting = {
    damage: number;
    sprite: Sprite;
};

type Enemy = {
    fadeFrame: number | null;
    sprite: Sprite;
    x: number;
    y: number;
};

type TinyVandalsWall = {
    app: Application<Renderer>;
    paintings: unknown[];
    enemies: Enemy[];
    width: number;
    height: number;
};

let app: Application<Renderer> | null = null;

export const addCircle = (x: number, y: number) => {
    if (!app) return;
    const circle = new Graphics();
    circle
        .circle(x * app.screen.width, y * app.screen.height, 10)
        .fill(0xff0000);
    app.stage.addChild(circle);
};

export async function createTinyVandalsWall({
    width = 2048 * 2,
    height = 2048 * 0.05 * 2,
}: {
    width?: number;
    height?: number;
}): Promise<TinyVandalsWall> {
    // Create a PixiJS application.
    app = new Application();

    // Intialize the application.
    await app.init({
        width,
        height,
        background: "#7b1c31",
    });

    document.body.appendChild(app.canvas);

    const container = new Container();
    container.position.set(0, height);
    container.scale.y = -1;
    app.stage.addChild(container);

    const paintings: Painting[] = [];
    for (let index = 0; index < 3; index++) {
        // Create a new Sprite from an image path
        const sprite = new Sprite(paintingTextures[index]);

        // Add to stage
        container.addChild(sprite);
        const painting = {
            damage: 0,
            sprite,
        };

        // Center the sprite's anchor point
        sprite.anchor.set(0.5);
        sprite.scale.set(0.6);

        // Move the sprite to the center of the screen
        sprite.x = (width / 4) * index + 300;
        sprite.y = height / 2;
        paintings.push(painting);
    }

    const enemies: Enemy[] = [];
    for (let index = 0; index < 1; index++) {
        // Create a new Sprite from an image path
        const sprite = new Sprite(spiderTexture);

        // Add to stage
        container.addChild(sprite);
        const enemy = {
            fadeFrame: null,
            x: width / 2,
            y: height / 2,
            sprite,
        };

        // Center the sprite's anchor point
        sprite.anchor.set(0.5);
        sprite.scale.set(0.128);

        // Move the sprite to the center of the screen
        sprite.x = enemy.x;
        sprite.y = enemy.y;
        enemies.push(enemy);
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
        enemy.x += (Math.random() - 0.5) * 2;
        enemy.y += (Math.random() - 0.5) * 1;
        enemy.x = Math.max(0, Math.min(app.width, enemy.x));
        enemy.y = Math.max(0, Math.min(app.height, enemy.y));
        enemy.sprite.x = enemy.x;
        enemy.sprite.y = enemy.y;
    }
}

/**
 * This will scare the enemy and make it go away.
 */
export async function castRayAtTinyVandalsWall(
    app: TinyVandalsWall,
    x: number,
    y: number,
    intensity = 1,
) {
    for (const enemy of app.enemies) {
        if (enemy.fadeFrame === null) {
            continue;
        }
        const dist = Math.sqrt((enemy.x - x) ** 2 + (enemy.y - y) ** 2);
        if (enemy.fadeFrame === null && dist < 30) {
            enemy.fadeFrame === 30;
        }
    }
}
