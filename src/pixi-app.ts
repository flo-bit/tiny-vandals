import { Application, Graphics, Container, Renderer } from "pixi.js";
import { setupPaintings } from "./paintings";
import { Enemy } from "./enemy";

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

    await setupPaintings(container);

    const enemies: Enemy[] = [new Enemy(app, container)];

    wall = {
        app,
        enemies,
    };
    return wall;
}

export async function updateTinyVandalsWall(wall: TinyVandalsWall) {
    for (const enemy of wall.enemies) {
        enemy.updateFrame(wall.app);
    }
}

export const drawDebugCircle = (x: number, y: number, color?: number) => {
    if (!wall) return;
    const circle = new Graphics();
    circle.circle(x, wall.app.screen.height - y, 5).fill(color ?? 0xffff00);
    circle.zIndex = 10;
    wall.app.stage.addChild(circle);
};

/**
 * This will scare the enemy and make it go away.
 */
export async function castRayAtTinyVandalsWall(xOnUV: number, yOnUV: number) {
    if (!wall) return;
    const x = xOnUV * wall.app.screen.width;
    const y = yOnUV * wall.app.screen.height;

    for (const enemy of wall.enemies) {
        enemy.checkRaycast(x, y);
    }
}
