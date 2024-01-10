import { Graphics, Text, TextStyle } from "pixi.js";
import { colors } from "../utils/constatns";
import Pier from "./Pier";
import { app } from "..";
import Ship from "./Ship";

class Port {
    private piers: Pier[];
    private entranceLine: Graphics;
    private loadedWaitingArea: Graphics;
    private emptyWaitingArea: Graphics;

    constructor() {
        this.piers = [];

        const portWidth = app.screen.width / 3;
        const portHeight = app.screen.height;

        const pierWidth = 50;
        const pierHeight = portHeight / 6.5;
        const gapBetweenPiers = 20;

        this.createPort(portWidth, portHeight);
        this.createPiers(pierWidth, pierHeight, gapBetweenPiers);

        this.entranceLine = new Graphics();
        this.entranceLine.lineStyle(25, colors.RED);
        const centerY = app.screen.height / 2;

        this.entranceLine.moveTo(app.screen.width / 3, centerY - app.screen.height / 6);
        this.entranceLine.lineTo(app.screen.width / 3, centerY + app.screen.height / 6);

        this.emptyWaitingArea = new Graphics();
        this.loadedWaitingArea = new Graphics();
        this.createWaitingAreas();

        app.stage.addChild(this.entranceLine);
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

        const labelText = color === colors.RED ? "Loaded ships waiting..." : "Empty ships waiting...";

        const text = new Text(labelText, textStyle);
        text.position.set(x + width / 2 - text.width / 2, y + height / 2 - text.height / 2);

        app.stage.addChild(waitingArea, text);

        return waitingArea;
    }

    createPort(width: number, height: number) {
        const port = new Graphics();
        port.lineStyle(2, colors.YELLOW);
        port.beginFill(0x1099bb);
        port.drawRect(0, 0, width, height);

        port.endFill();
        app.stage.addChild(port);
    }

    createPiers(width: number, height: number, gap: number) {
        const totalPiersHeight = 4 * (height + gap) - gap;
        const startY = (app.screen.height - totalPiersHeight) / 2;

        for (let i = 0; i < 4; i++) {
            const pier = new Pier();
            pier.createPier(width, height, gap, startY, i);
            this.piers.push(pier);
        }
    }

    getEntranceLocation() {
        return this.entranceLine.getBounds();
    }

    getWaitingArea(isLoaded: boolean) {
        if (isLoaded) {
            return this.loadedWaitingArea;
        } else {
            return this.emptyWaitingArea;
        }
    }

    getFreePier(ship: Ship) {
        const freePier = this.piers.find((pier) => !pier.isLoading && !pier.isLoaded);

        if (freePier) {
            return freePier;
        } else {
            const pier = this.piers.find((pier) => !pier.isLoading && pier.isLoaded);

            if (pier) {
                pier.startUnloading();
                ship.unloadCargo();
                return pier;
            } else {
                return null;
            }
        }
    }
}

export default Port;
