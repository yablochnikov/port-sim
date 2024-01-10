import "pixi-spine";
import "./style.css";
import { Application } from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import Port from "./classes/Port";
import Ship from "./classes/Ship";
import { colors } from "./utils/constatns";

const gameWidth = 1280;
const gameHeight = 720;

console.log(
    `%cPixiJS V7\nTypescript Boilerplate%c ${VERSION} %chttp://www.pixijs.com %c❤️`,
    "background: #ff66a1; color: #FFFFFF; padding: 2px 4px; border-radius: 2px; font-weight: bold;",
    "color: #D81B60; font-weight: bold;",
    "color: #C2185B; font-weight: bold; text-decoration: underline;",
    "color: #ff66a1;",
);

export const app = new Application<HTMLCanvasElement>({
    backgroundColor: colors.SEA,
    width: gameWidth,
    height: gameHeight,
});

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.scale.x = window.innerWidth / gameWidth;
        app.stage.scale.y = window.innerHeight / gameHeight;
    };

    resize();

    window.addEventListener("resize", resize);
}

export const port = new Port();

app.ticker.add(() => {
    TWEEN.update();
});

window.onload = async (): Promise<void> => {
    document.body.appendChild(app.view);

    resizeCanvas();

    const ships: Ship[] = [];

    const newShip = new Ship();

    app.stage.addChild(newShip.getShip());
    newShip.moveToWaitingArea();

    setInterval(() => {
        const newShip = new Ship();
        app.stage.addChild(newShip.getShip());
        newShip.moveToWaitingArea();

        ships.push(newShip);

        if (ships.length > 4) {
            ships.shift();
        }
    }, 8000);
};
