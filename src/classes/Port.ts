import { Graphics } from "pixi.js";
import { colors } from "../utils/constants";
import Pier from "./Pier";
import { app } from "..";

class Port {
    private piers: Pier[];
    private entranceLine: Graphics = new Graphics();

    constructor() {
        this.piers = [];

        const portWidth = app.screen.width / 3;
        const portHeight = app.screen.height;

        const pierWidth = 50;
        const pierHeight = portHeight / 6.5;
        const gapBetweenPiers = 20;

        this.createPort(portWidth, portHeight);
        this.createPiers(pierWidth, pierHeight, gapBetweenPiers);

        this.createEntranceLine();
    }

    private createPort(width: number, height: number) {
        const port = new Graphics();
        port.lineStyle(2, colors.YELLOW);
        port.beginFill(0x1099bb);
        port.drawRect(0, 0, width, height);
        port.endFill();
        app.stage.addChild(port);
    }

    private createPiers(width: number, height: number, gap: number) {
        const totalPiersHeight = 4 * (height + gap) - gap;
        const startY = (app.screen.height - totalPiersHeight) / 2;

        for (let i = 0; i < 4; i++) {
            const pier = new Pier();
            pier.createPier(width, height, gap, startY, i);
            this.piers.push(pier);
        }
    }

    private createEntranceLine() {
        this.entranceLine = new Graphics();
        this.entranceLine.lineStyle(25, colors.SEA);
        const centerY = app.screen.height / 2;

        this.entranceLine.moveTo(app.screen.width / 3, centerY - app.screen.height / 6);
        this.entranceLine.lineTo(app.screen.width / 3, centerY + app.screen.height / 6);

        app.stage.addChild(this.entranceLine);
    }

    getEntranceLocation() {
        return this.entranceLine.getBounds();
    }

    getFreePier() {
        return this.piers.find((pier) => !pier.isLoaded && !pier.isLoading);
    }

    getLoadedPier() {
        return this.piers.find((pier) => !pier.isLoading && pier.isLoaded);
    }
}

export default Port;
