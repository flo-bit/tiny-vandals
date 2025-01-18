import { Application, Assets, Graphics, Renderer, Sprite } from "pixi.js";

const bunnyTexture = await Assets.load("/tiny-vandals/images/spider.png");
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
  circle.circle(x * app.screen.width, y * app.screen.height, 10).fill(0xff0000);
  app.stage.addChild(circle);
};

export async function createTinyVandalsWall({
  width = 2048 * 4,
  height = 2048 * 0.05 * 4,
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
    background: "#313131",
  });

  document.body.appendChild(app.canvas);

  const enemies: Enemy[] = [];
  for (let index = 0; index < 1; index++) {
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
    bunny.scale.set(0.1);

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
    enemy.x += (Math.random() - 0.5) * 2;
    enemy.y += (Math.random() - 0.5) * 2;
    enemy.x = Math.max(0, Math.min(app.width, enemy.x));
    enemy.y = Math.max(0, Math.min(app.height, enemy.y));
    enemy.sprite.x = enemy.x;
    enemy.sprite.y = enemy.y;
  }
}
