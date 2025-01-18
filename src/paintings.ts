import * as PIXI from "pixi.js";

const paintingData: {
    x: number;
    y: number;
    width: number;
    height: number;
    border: number;
    borderColor?: number;
    image: string;
    name: string;
    price: number;
}[] = [
    {
        x: 1000,
        y: 600,
        width: 768 / 2,
        height: 1087 / 2,
        border: 10,
        image: "/tiny-vandals/paintings/banksy.jpg",
        name: "Girl with the Balloon", // Updated name
        price: 2000000, // Rough estimate
    },
    {
        x: 3000,
        y: 600,
        width: 512,
        height: 512,
        border: 10,
        image: "/tiny-vandals/paintings/mondrian.jpg",
        name: "Mondrian Composition",
        price: 25000000, // Rough estimate
    },
    {
        x: 5000,
        y: 600,
        width: 800 * 0.7,
        height: 947 * 0.7,
        border: 10,
        image: "/tiny-vandals/paintings/girl-earing.jpg",
        name: "Girl with a Pearl Earring",
        price: 150000000, // Rough estimate
    },
    {
        x: 7000,
        y: 600,
        width: 640 * 0.7,
        height: 954 * 0.7,
        border: 10,
        image: "/tiny-vandals/paintings/mona-lisa.jpg.webp",
        name: "Mona Lisa",
        price: 850000000, // Rough estimate
    },
    {
        x: 9000,
        y: 600,
        width: 2140 / 4,
        height: 2699 / 4,
        border: 10,
        image: "/tiny-vandals/paintings/nebelmeer.jpg",
        name: "Wanderer above the Sea of Fog",
        price: 75000000, // Rough estimate
    },
    {
        x: 11000,
        y: 600,
        width: 810 / 1.5,
        height: 1024 / 1.5,
        border: 10,
        image: "/tiny-vandals/paintings/scream.jpg",
        name: "The Scream",
        price: 120000000, // Rough estimate
    },
    {
        x: 13400,
        y: 600,
        width: 1200 * 0.7,
        height: 950 * 0.7,
        border: 10,
        image: "/tiny-vandals/paintings/starry-night.jpg",
        name: "Starry Night",
        price: 100000000, // Rough estimate
    },
    {
        x: 15000,
        y: 600,
        width: 251 * 2,
        height: 251 * 2,
        border: 10,
        image: "/tiny-vandals/paintings/willie.jpg",
        name: "Steamboat Willie", // Updated name
        price: 500, // Rough estimate
    },
];

export class Painting extends PIXI.Sprite {
    damage: number = 0;
    name: string = "";
    price: number = 0;
}

const paintings: Painting[] = [];

export const setupPaintings = async (container: PIXI.Container) => {
    for (const element of paintingData) {
        const sprite = new Painting(await PIXI.Assets.load(element.image));
        sprite.x = element.x;
        sprite.y = element.y;
        sprite.width = element.width;
        sprite.height = element.height;
        sprite.name = element.name;
        sprite.price = element.price;

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
            .fill(element.borderColor ?? 0);

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

export const getDamagePerPainting = () => {
    return paintings.map((painting) => {
        let damagePercent = 0;
        if (painting.damage === 0) damagePercent = 0;
        else if (painting.damage < 100) damagePercent = 0.2;
        else if (painting.damage < 200) damagePercent = 0.4;
        else if (painting.damage < 300) damagePercent = 0.6;
        else if (painting.damage < 400) damagePercent = 0.8;
        else if (painting.damage < 500) damagePercent = 1;

        return {
            name: painting.name,
            damage: painting.damage,
            damages: damagePercent * painting.price,
            price: painting.price,
        };
    });
};
