import { Application, Text } from "pixi.js";

type EndcardInfo = {
    paintings: {
        name: string,
        damages: number,
    }[],
};

export async function createTinyVandalsEndcard(info: EndcardInfo) {
    // Create a PixiJS application.
    const app = new Application();

    // Intialize the application.
    await app.init({
        width: 1024,
        height: 1024,
    });

    const titleText = new Text({
        text: 'DAMAGE REPORT',
        style: {
            fontSize: 32,
            fill: 0xffffff,
        }
    });
    titleText.x = app.screen.width / 2;
    titleText.y = 50;
    titleText.anchor.set(0.5, 0);
    app.stage.addChild(titleText);

    // Add a line for each painting
    info.paintings.forEach((painting, index) => {
        const text = new Text({
            text: `${painting.name}: ${painting.damages} damages`,
            style: {
                fontSize: 24,
                fill: 0xffffff,
            }
        });
        text.x = app.screen.width - 50; // Right margin of 50 pixels
        text.y = 120 + index * 40; // Start below title, 40 pixels between each line
        text.anchor.set(1, 0); // Right-align the text
        app.stage.addChild(text);
    });

    return app;
}
