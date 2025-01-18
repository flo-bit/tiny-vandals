import * as PIXI from "pixi.js";
import { addDamage, nearestPainting, Painting } from "./paintings";
import { drawDebugCircle } from "./pixi-app";
const spiderTextures = [
    await PIXI.Assets.load("/tiny-vandals/images/Monster1-1.png"),
    await PIXI.Assets.load("/tiny-vandals/images/Monster1-2.png"),
    await PIXI.Assets.load("/tiny-vandals/images/Monster1-1attack.png"),
    await PIXI.Assets.load("/tiny-vandals/images/Monster1-2attack.png"),
];
// const monster2Textures = [
//     await PIXI.Assets.load("/tiny-vandals/images/Monster2-1.png"),
//     await PIXI.Assets.load("/tiny-vandals/images/Monster2-2.png"),
//     await PIXI.Assets.load("/tiny-vandals/images/Monster2-1attack.png"),
//     await PIXI.Assets.load("/tiny-vandals/images/Monster2-2attack.png"),
// ];

export class Enemy extends PIXI.AnimatedSprite {
    fadeFrame: number | null = null;

    closestPainting: Painting | null = null;

    constructor(app: PIXI.Application, container: PIXI.Container) {
        super(spiderTextures);

        this.loop = true;
        this.animationSpeed = 0.04;
        this.play();

        // Add to stage
        container.addChild(this);

        this.scale.set(0.5);
        this.anchor.set(0.5);

        this.x = Math.random() * app.screen.width;
        this.y = Math.random() < 0.5 ? -50 : app.screen.height + 50;

		this.zIndex = 1000;

        // get closest painting
        this.closestPainting = nearestPainting(this.x, this.y);
    }

    updateFrame(app: PIXI.Application) {
        if (this.fadeFrame !== null) {
            this.fadeFrame -= 1;
            this.alpha = Math.max(0, this.fadeFrame / 30);
            if (this.fadeFrame <= 0) {
                // Spawn it somewhere else
                this.x = Math.random() * app.screen.width;
                this.y = Math.random() < 0.5 ? -50 : app.screen.height + 50;
                this.fadeFrame = null;
                this.alpha = 1;
                this.closestPainting = null;
            }
        } else if (this.closestPainting) {
            const angle = Math.atan2(
                this.closestPainting.y - this.y,
                this.closestPainting.x - this.x,
            );
            this.x += Math.cos(angle) * 1;
            this.y += Math.sin(angle) * 1;

            // get distance to painting
            const distance = Math.hypot(
                this.x - this.closestPainting.x,
                this.y - this.closestPainting.y,
            );
            if (distance < 10) {
                this.fadeFrame = 30;
            }

            // drop painting
            if (Math.random() < 1) {
                let randomDist = Math.random() * 100;
                let randomAngle = Math.random() * Math.PI * 2;
                let rx = this.x + randomDist * Math.cos(randomAngle);
                let ry = this.y + randomDist * Math.sin(randomAngle);
                drawDebugCircle(rx, ry);

                addDamage(rx, ry);
            }
        }

        if (!this.closestPainting) {
            this.closestPainting = nearestPainting(this.x, this.y);
        }
    }

    checkRaycast(x: number, y: number) {
        if (this.fadeFrame !== null) return;

        const dist = Math.hypot(this.x - x, this.y - y);
        if (dist < 100) {
            console.log(x, y, dist);
            this.fadeFrame = 30;
        }
    }
}
