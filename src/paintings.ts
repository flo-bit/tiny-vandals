import * as PIXI from "pixi.js";

const paintingData = [
    {
        x: 1000,
        y: 600,
        width: 768 / 2,
        height: 1087 / 2,
        border: 10,
        image: "/tiny-vandals/paintings/banksy.jpg",
    },
    {
        x: 3000,
        y: 600,
        width: 512,
        height: 512,
        border: 10,
        image: "/tiny-vandals/paintings/mondrian.jpg",
    },
    {
        x: 5000,
        y: 600,
        width: 800,
        height: 947,
        border: 10,
        image: "/tiny-vandals/paintings/girl-earing.jpg",
    },
    {
        x: 7000,
        y: 600,
        width: 640,
        height: 954,
        border: 10,
        image: "/tiny-vandals/paintings/mona-lisa.jpg.webp",
    },
    {
        x: 9000,
        y: 600,
        width: 2140 / 4,
        height: 2699 / 4,
        border: 10,
        image: "/tiny-vandals/paintings/nebelmeer.jpg",
    },
    {
        x: 11000,
        y: 600,
        width: 810 / 1.5,
        height: 1024 / 1.5,
        border: 10,
        image: "/tiny-vandals/paintings/scream.jpg",
    },
    {
        x: 13400,
        y: 600,
        width: 1200,
        height: 950,
        border: 10,
        image: "/tiny-vandals/paintings/starry-night.jpg",
    },
    {
        x: 15000,
        y: 600,
        width: 251 * 2,
        height: 251 * 2,
        border: 10,
        image: "/tiny-vandals/paintings/willie.jpg",
    },
];

class Painting extends PIXI.Sprite {
    damage: number = 0;
}

const paintings: Painting[] = [];

export const setupPaintings = async (
    app: PIXI.Application,
    container: PIXI.Container,
) => {
    for (const element of paintingData) {
        const sprite = new Painting(await PIXI.Assets.load(element.image));
        sprite.x = element.x;
        sprite.y = element.y;
        sprite.width = element.width;
        sprite.height = element.height;

        sprite.anchor.set(0.5);

        container.addChild(sprite);

        paintings.push(sprite);

        const graphic = new PIXI.Graphics();
        graphic
            .rect(
                sprite.x - sprite.width / 2 - element.border,
                sprite.y - sprite.height / 2 - element.border,
                sprite.width + element.border * 2,
                sprite.height + element.border * 2,
            )
            .fill(element.borderColor);

        graphic.zIndex = -1;
        container.addChild(graphic);
    }
};

export const nearestPainting = (x: number, y: number) => {
    let nearest: Painting | null = null;
    let nearestDistance = Infinity;
    for (const painting of paintings) {
        const distance = Math.sqrt(
            (painting.x - x) ** 2 + (painting.y - y) ** 2,
        );
        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearest = painting;
        }
    }
    return nearest;
};

export const addDamage = (x: number, y: number) => {
    // check if x, y is in painting
    for (const painting of paintings) {
        if (
            x > painting.x - painting.width / 2 &&
            x < painting.x + painting.width / 2 &&
            y > painting.y - painting.height / 2 &&
            y < painting.y + painting.height / 2
        ) {
            painting.damage++;
            console.log(painting.damage);
        }
    }
};
