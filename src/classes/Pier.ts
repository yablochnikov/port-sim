import { Graphics } from "pixi.js";
import { app } from "..";
import { colors } from "../utils/constants";

class Pier {
    private pier: Graphics;
    isLoaded: boolean = false;
    isLoading: boolean = false;

    constructor() {
        this.pier = new Graphics();
        this.pier.lineStyle(2, "0xffff00");
        this.pier.beginFill(colors.SEA);
    }

    createPier(width: number, height: number, gap: number, startY: number, index: number): void {
        const y = startY + index * (height + gap);
        this.pier.drawRect(0, y, width, height);
        app.stage.addChild(this.pier);
    }

    loadCargo(): void {
        this.pier.tint = colors.LOADED_PIER;

        this.isLoaded = true;
    }

    unloadCargo(): void {
        this.pier.tint = 0xffffff;
        this.isLoaded = false;
    }

    getPier() {
        return this.pier;
    }

    setLoading(value: boolean) {
        this.isLoading = value;
    }
}

export default Pier;
