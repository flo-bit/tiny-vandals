import {
    Application,
    Assets,
    Graphics,
    Container,
    Renderer,
    Sprite,
    AnimatedSprite,
} from "pixi.js";
import { setupPaintings } from "./paintings";

const spiderTextures = [
    await Assets.load("/tiny-vandals/images/Monster1.png"),
    await Assets.load("/tiny-vandals/images/Monster1-2.png")
];
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
    enemies: Enemy[];
};

let wall: TinyVandalsWall | null = null;

export async function createTinyVandalsWall({
    width = 2048 * 8,
    height = 2048 * 0.075 * 8,
}: {
    width?: number;
    height?: number;
}): Promise<TinyVandalsWall> {
    // Create a PixiJS application.
    const app = new Application();

    // Intialize the application.
    await app.init({
        width,
        height,
        background: "#7b1c31",
    });

    const container = new Container();
    container.position.set(0, height);
    container.scale.y = -1;
    app.stage.addChild(container);

    await setupPaintings(app, container);

    const enemies: Enemy[] = [];
    for (let index = 0; index < 1; index++) {
        // Create a new Sprite from an image path
        const sprite = new AnimatedSprite(spiderTextures, true);
        sprite.loop = true;
        sprite.animationSpeed = 0.04;
        sprite.play();

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
        sprite.scale.set(0.5);

        // Move the sprite to the center of the screen
        sprite.x = enemy.x;
        sprite.y = enemy.y;
        enemies.push(enemy);
    }

    wall = {
        app,
        enemies,
    };
    return wall;
}

const MONSTER_WALL_PADDING = 20;

export async function updateTinyVandalsWall(wall: TinyVandalsWall) {
    for (const enemy of wall.enemies) {
        if (enemy.fadeFrame !== null) {
            enemy.fadeFrame -= 1;
            enemy.sprite.alpha = Math.max(0, enemy.fadeFrame / 30);
            if (enemy.fadeFrame <= 0) {
                // Spawn it somewhere else
                enemy.x = Math.random() * wall.app.screen.width;
                enemy.y = Math.random() * wall.app.screen.height;
                enemy.fadeFrame = null;
                enemy.sprite.alpha = 1;
            }
        } else {
            enemy.x += (Math.random() - 0.5) * 2;
            enemy.y += (Math.random() - 0.5) * 1;
            enemy.x = Math.max(MONSTER_WALL_PADDING, Math.min(wall.app.screen.width - MONSTER_WALL_PADDING, enemy.x));
            enemy.y = Math.max(MONSTER_WALL_PADDING, Math.min(wall.app.screen.height - MONSTER_WALL_PADDING, enemy.y));
        }
        enemy.sprite.x = enemy.x;
        enemy.sprite.y = enemy.y;
    }
}

const drawDebugCircle = (x: number, y: number, color?: number) => {
    if (!wall) return;
    const circle = new Graphics();
    circle
        .circle(x, y, 1)
        .fill(color ?? 0xff0000);
    wall.app.stage.addChild(circle);
};

/**
 * This will scare the enemy and make it go away.
 */
export async function castRayAtTinyVandalsWall(
    xOnUV: number,
    yOnUV: number,
    intensity = 1,
) {
    if (!wall) return;
    const x = xOnUV * wall.app.screen.width;
    const y = yOnUV * wall.app.screen.height;
    drawDebugCircle(x, y);
    for (const enemy of wall.enemies) {
        if (enemy.fadeFrame !== null) {
            continue;
        }
        const dist = Math.sqrt((enemy.x - x) ** 2 + (enemy.y - y) ** 2);
        if (dist < 30) {
            console.log(x, y,)
            enemy.fadeFrame = 30;
            drawDebugCircle(x, y, 0x00ff00);
        }
    }
}
