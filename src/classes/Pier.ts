import { Graphics } from "pixi.js";
import { app } from "..";
import { colors } from "../utils/constatns";

class Pier {
    private pier: Graphics;
    isLoaded: boolean;
    isLoading: boolean;

    constructor() {
        this.pier = new Graphics();
        this.isLoaded = false;
        this.isLoading = false;
    }

    createPier(width: number, height: number, gap: number, startY: number, index: number): void {
        this.pier.lineStyle(2, "0xffff00");
        this.pier.beginFill(colors.SEA);
        const y = startY + index * (height + gap);
        this.pier.drawRect(0, y, width, height);
        app.stage.addChild(this.pier);
    }

    getLocation() {
        return this.pier.getBounds();
    }

    updatePierCargo(): void {
        this.pier.clear();
        this.pier.lineStyle(2, colors.YELLOW);

        if (this.isLoaded) {
            this.pier.beginFill(colors.LOADED_PIER);
        } else {
            this.pier.beginFill(colors.SEA);
        }

        const bounds = this.pier.getBounds();
        this.pier.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }

    startLoading(): void {
        this.isLoading = true;
        this.updatePierCargo();
    }

    startUnloading(): void {
        this.isLoading = true;
        this.updatePierCargo();
    }

    completeLoading(): void {
        this.isLoading = false;
        this.isLoaded = true;
        this.updatePierCargo();
    }

    completeUnloading(): void {
        this.isLoading = false;
        this.isLoaded = false;
        this.updatePierCargo();
    }

    getPier(): Graphics {
        return this.pier;
    }
}

export default Pier;
