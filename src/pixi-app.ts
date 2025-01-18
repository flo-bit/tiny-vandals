import { Application, Assets, Container, Renderer, Sprite } from "pixi.js";

const bunnyTexture = await Assets.load("/tiny-vandals/images/spider.png");
const paintingTextures = [
    await Assets.load("/tiny-vandals/images/painting01.png"),
    await Assets.load("/tiny-vandals/images/painting02.png"),
    await Assets.load("/tiny-vandals/images/painting03.png"),
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

export async function createTinyVandalsWall({
    width = 2048 * 2,
    height = 2048 * 0.05 * 2,
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
        background: "#ff99bb",
    });

    document.body.appendChild(app.canvas);

    const container = new Container();
    container.position.set(0, height);
    container.scale.y = -1;
    app.stage.addChild(container);

    const enemies: Enemy[] = [];
    for (let index = 0; index < 4; index++) {
        // Create a new Sprite from an image path
        const sprite = new Sprite(bunnyTexture);

        // Add to stage
        container.addChild(sprite);
        const enemy = {
            x: width / 2,
            y: height / 2,
            sprite,
        };

        // Center the sprite's anchor point
        sprite.anchor.set(0.5);
        sprite.scale.set(0.1);

        // Move the sprite to the center of the screen
        sprite.x = enemy.x;
        sprite.y = enemy.y;
        enemies.push(enemy);
    }

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
        sprite.x = (width / 4) * index + 150;
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
        enemy.x += (Math.random() - 0.5) * 2;
        enemy.y += (Math.random() - 0.5) * 2;
        enemy.x = Math.max(0, Math.min(app.width, enemy.x));
        enemy.y = Math.max(0, Math.min(app.height, enemy.y));
        enemy.sprite.x = enemy.x;
        enemy.sprite.y = enemy.y;
    }
}
