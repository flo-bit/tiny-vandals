import { Application, Text } from "pixi.js";

type EndcardInfo = {
    paintings: {
        name: string,
        damages: number,
    }[],
};

export async function showEndcard(info: EndcardInfo) {
}
