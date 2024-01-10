import { Graphics } from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import { app, port } from "..";
import { colors } from "../utils/constatns";

class Ship {
    private ship: Graphics;
    private hasCargo: boolean = Math.random() >= 0.5;
    private isLoaded: boolean = false;

    constructor() {
        this.ship = new Graphics();
        this.createShip();
        this.moveToWaitingArea();
    }

    createShip() {
        const randomY = Math.random() * app.screen.height;

        const x = app.screen.width - 30;

        if (this.hasCargo) {
            this.ship.beginFill(colors.RED);
        } else {
            this.ship.lineStyle(2, colors.GREEN);
        }
        this.ship.drawRect(0, 0, 150, 30);
        this.ship.position.set(x, randomY);
        app.stage.addChild(this.ship);
    }

    getShip(): Graphics {
        return this.ship;
    }

    moveToWaitingArea() {
        const waitingArea = port.getWaitingArea(this.hasCargo).getBounds();
        const centerX = waitingArea.x;
        const centerY = waitingArea.y;

        if (this.hasCargo) {
            new TWEEN.Tween(this.ship.position)
                .to({ x: centerX, y: centerY }, 3000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()
                .onComplete(() => {});
        } else {
            new TWEEN.Tween(this.ship.position)
                .to({ x: centerX, y: centerY }, 3000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()
                .onComplete(() => {});
        }
    }

    moveToEntrance() {
        const entranceLine = port.getEntranceLocation();
        const centerX = entranceLine.x;
        const centerY = entranceLine.y;

        new TWEEN.Tween(this.ship.position)
            .to({ x: centerX, y: centerY }, 3000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start()
            .onComplete(() => {
                // const freePier = port.getFreePier(this.ship);
            });
    }

    unloadCargo() {
        this.hasCargo = false;
        this.isLoaded = false;
        this.ship.clear();
        this.ship.lineStyle(2, colors.RED);
        this.ship.drawRect(0, 0, 150, 30);
    }
}

export default Ship;
