import { Graphics } from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import { app, port, waitingArea } from "..";
import { colors } from "../utils/constants";
import Pier from "./Pier";

class Ship {
    private ship: Graphics;
    private hasCargo: boolean = Math.random() >= 0.5;
    private isLoaded: boolean = false;
    private loadedQueue: Ship[] = [];
    private unloadedQueue: Ship[] = [];
    private checkPortInterval: NodeJS.Timeout | null = null;

    constructor() {
        this.ship = new Graphics();
    }

    getHasCargo(): boolean {
        return this.hasCargo;
    }

    getIsLoaded(): boolean {
        return this.isLoaded;
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

    private checkPortAvailability() {
        this.checkPortInterval = setInterval(() => {
            const loadedPier = port.getLoadedPier();
            const freePier = port.getFreePier();

            if (!this.isLoaded && this.shouldMoveQueue(this) && freePier && !freePier.isLoaded && !freePier.isLoading) {
                this.moveToEntrance(this);
                this.stopCheckPortInterval();
            } else if (
                this.isLoaded &&
                this.shouldMoveQueue(this) &&
                loadedPier &&
                loadedPier.isLoaded &&
                !loadedPier.isLoading
            ) {
                this.moveToEntrance(this);
                this.stopCheckPortInterval();
            }
        }, 2500);
    }

    private stopCheckPortInterval() {
        if (this.checkPortInterval !== null) {
            clearInterval(this.checkPortInterval);
            this.checkPortInterval = null;
        }
    }
    moveToWaitingArea(ship: Ship) {
        const currentWaitingArea = waitingArea.getWaitingArea(ship.hasCargo).getBounds();
        const centerX = currentWaitingArea.x;
        const centerY = currentWaitingArea.y;

        if (ship.hasCargo) {
            this.loadedQueue.push(ship);
            new TWEEN.Tween(ship.getShip().position)
                .to({ x: centerX, y: centerY }, 3000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()
                .onComplete(() => {
                    waitingArea.addToLoadedQueue(ship);
                });
        } else {
            this.unloadedQueue.push(ship);
            new TWEEN.Tween(ship.getShip().position)
                .to({ x: centerX, y: centerY }, 3000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()
                .onComplete(() => {
                    waitingArea.addToEmptyQueue(ship);
                });
        }
        this.checkPortAvailability();
    }

    private modifyShipAppearance(ship: Ship, color: number) {
        this.ship.clear();
        this.ship.lineStyle(2, color);
        this.ship.drawRect(ship.getShip().position.x, ship.getShip().position.y, 150, 30);
    }

    moveToEntrance(ship: Ship) {
        const entranceLine = port.getEntranceLocation();
        const centerX = entranceLine.x;
        const centerY = entranceLine.y;

        const loadedPier = port.getLoadedPier();
        const freePier = port.getFreePier();

        const moveToPier = (pier: Pier) => {
            const pierBounds = pier.getPier().getBounds();

            pier.setLoading(true);

            new TWEEN.Tween(ship.getShip().position)
                .to(pierBounds, 3000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()
                .onComplete(() => {
                    setTimeout(() => {
                        this.finalizeShipMovement(ship);

                        if (ship.hasCargo) {
                            pier.loadCargo();
                            this.modifyShipAppearance(ship, colors.RED);
                        } else {
                            pier.unloadCargo();
                            this.modifyShipAppearance(ship, colors.GREEN);
                        }
                        pier.setLoading(false);
                    }, 5000);
                });
        };

        const startMove = (pier: Pier) => {
            new TWEEN.Tween(ship.getShip().position)
                .to({ x: centerX, y: centerY })
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()
                .onComplete(() => moveToPier(pier));
        };

        if (ship.hasCargo && freePier && !freePier.isLoaded && !freePier.isLoading) {
            startMove(freePier);
        } else if (!ship.hasCargo && loadedPier && loadedPier.isLoaded && !loadedPier.isLoading) {
            moveToPier(loadedPier);
        }
    }

    shouldMoveQueue(ship: Ship): boolean {
        const loadedPier = port.getLoadedPier();
        const freePier = port.getFreePier();

        if (ship.hasCargo && freePier && !freePier.isLoaded && !freePier.isLoading) {
            return true;
        } else if (!ship.hasCargo && loadedPier && loadedPier.isLoaded && !loadedPier.isLoading) {
            return true;
        }

        return false;
    }

    private finalizeShipMovement(ship: Ship) {
        new TWEEN.Tween(ship.getShip().position)
            .to({
                x: app.screen.width + 1000,
                y: app.screen.height / 2,
            })
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }
}

export default Ship;
