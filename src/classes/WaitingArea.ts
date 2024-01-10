import { Graphics, TextStyle, Text } from "pixi.js";
import { app } from "..";
import { colors } from "../utils/constants";
import Ship from "./Ship";

class WaitingArea {
    private emptyShipsQueue: Ship[] = [];
    private loadedShipsQueue: Ship[] = [];
    private loadedWaitingArea: Graphics = new Graphics();
    private emptyWaitingArea: Graphics = new Graphics();

    constructor() {
        this.createWaitingAreas();
    }

    createWaitingAreas() {
        const waitingAreaWidth = 340;
        const waitingAreaHeight = 250;

        this.loadedWaitingArea = this.createWaitingArea(
            (app.screen.width - waitingAreaWidth) / 2,
            0,
            waitingAreaWidth,
            waitingAreaHeight,
            colors.RED,
        );

        this.emptyWaitingArea = this.createWaitingArea(
            (app.screen.width - waitingAreaWidth) / 2,
            app.screen.height - waitingAreaHeight,
            waitingAreaWidth,
            waitingAreaHeight,
            colors.GREEN,
        );

        app.stage.addChild(this.loadedWaitingArea, this.emptyWaitingArea);
    }

    createWaitingArea(x: number, y: number, width: number, height: number, color: number): Graphics {
        const waitingArea = new Graphics();
        waitingArea.lineStyle(2, color);
        waitingArea.drawRect(x, y, width, height);
        waitingArea.endFill();

        const textStyle = new TextStyle({
            fill: 0xffffff,
            fontSize: 16,
            fontWeight: "bold",
            align: "center",
            wordWrap: true,
            wordWrapWidth: width - 10,
        });

        const labelText = color === colors.RED ? `Ships waiting to be unloaded...` : `Ships waiting to be loaded`;

        const text = new Text(labelText, textStyle);
        text.position.set(x + width / 2 - text.width / 2, y + height / 2 - text.height / 2);

        app.stage.addChild(waitingArea, text);

        return waitingArea;
    }

    getWaitingArea(isLoaded: boolean) {
        if (isLoaded) {
            return this.loadedWaitingArea;
        } else {
            return this.emptyWaitingArea;
        }
    }

    addToEmptyQueue(ship: Ship): void {
        this.emptyShipsQueue.push(ship);
    }

    addToLoadedQueue(ship: Ship): void {
        this.loadedShipsQueue.push(ship);
    }
}

export default WaitingArea;
