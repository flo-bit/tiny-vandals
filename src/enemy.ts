import * as PIXI from "pixi.js";
const monster1Textures = [
    await PIXI.Assets.load("/tiny-vandals/images/Monster1-1.png"),
    await PIXI.Assets.load("/tiny-vandals/images/Monster1-2.png"),
    await PIXI.Assets.load("/tiny-vandals/images/Monster1-1attack.png"),
    await PIXI.Assets.load("/tiny-vandals/images/Monster1-2attack.png"),
];
const monster2Textures = [
    await PIXI.Assets.load("/tiny-vandals/images/Monster2-1.png"),
    await PIXI.Assets.load("/tiny-vandals/images/Monster2-2.png"),
    await PIXI.Assets.load("/tiny-vandals/images/Monster2-1attack.png"),
    await PIXI.Assets.load("/tiny-vandals/images/Monster2-2attack.png"),
];

const MONSTER_WALL_PADDING = 20;

export class Enemy extends PIXI.AnimatedSprite {
    fadeFrame: number | null = null;

    constructor(app: PIXI.Application, container: PIXI.Container) {
        super(monster1Textures);

        this.loop = true;
        this.animationSpeed = 0.04;
        this.play();

        // Add to stage
        container.addChild(this);

        this.scale.set(0.5);
        this.anchor.set(0.5);

        this.x = app.screen.width / 2;
        this.y = app.screen.height / 2;
    }

    updateFrame(app: PIXI.Application) {
        if (this.fadeFrame !== null) {
            this.fadeFrame -= 1;
            this.alpha = Math.max(0, this.fadeFrame / 30);
            if (this.fadeFrame <= 0) {
                // Spawn it somewhere else
                this.x = Math.random() * app.screen.width;
                this.y = Math.random() * app.screen.height;
                this.fadeFrame = null;
                this.alpha = 1;
            }
        } else {
            this.x += (Math.random() - 0.5) * 2;
            this.y += (Math.random() - 0.5) * 1;
            this.x = Math.max(
                MONSTER_WALL_PADDING,
                Math.min(app.screen.width - MONSTER_WALL_PADDING, this.x),
            );
            this.y = Math.max(
                MONSTER_WALL_PADDING,
                Math.min(app.screen.height - MONSTER_WALL_PADDING, this.y),
            );
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
