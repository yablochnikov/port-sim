import "pixi-spine";
import "./style.css";
import { Application } from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import Port from "./classes/Port";
import Ship from "./classes/Ship";
import WaitingArea from "./classes/WaitingArea";
import { colors } from "./utils/constants";

const gameWidth = 1280;
const gameHeight = 720;

console.log(
    `%cTest for onseo by Nikita Y. %c❤️`,
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

export const waitingArea = new WaitingArea();

const newShip = new Ship();
newShip.createShip();
newShip.moveToWaitingArea(newShip);

window.onload = async (): Promise<void> => {
    document.body.appendChild(app.view);

    resizeCanvas();

    const ships: Ship[] = [];

    setInterval(() => {
        const newShip = new Ship();
        newShip.createShip();
        newShip.moveToWaitingArea(newShip);

        ships.push(newShip);

        if (ships.length > 4) {
            ships.shift();
        }
    }, 8000);
};

app.ticker.add(() => {
    TWEEN.update();
});
