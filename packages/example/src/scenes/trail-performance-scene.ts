/* eslint-disable @typescript-eslint/naming-convention */
import { TrailComponent, TrailMaterial } from '@armathai/pixi-trail';
import { Container } from 'pixi.js';
import { SceneAbstract } from './scene-abstract';

export class TrailPerformanceScene extends SceneAbstract {
    private _trails: Array<TrailComponent> = [];
    private _objects: Array<Container> = [];
    private _count = 200;
    private _colsCount = 2;

    public constructor() {
        super();

        this.scale.set(0.2);

        for (let i = 0; i < this._count; i++) {
            const ball = new Container();
            this.addChild(ball);
            ball.y = 22;
            ball.x = -70;

            const trail = new TrailComponent(
                {
                    sharpness: true,
                    trailWidth: 30,
                    lifeSpan: 400,
                    minimalSquareDistance: 10,
                },
                new TrailMaterial()
            );

            this.addChild(trail);
            setTimeout(() => {
                trail.attachObject(ball);
            }, 100);

            this._trails.push(trail);
            this._objects.push(ball);
        }
    }

    public update(elapsed: number): void {
        this.x = -this._objects[0].x * this.scale.x + 250;

        for (let i = 0; i < this._colsCount; i++) {
            const start = i * Math.floor(this._count / this._colsCount);
            const end = start + Math.floor(this._count / this._colsCount);

            for (let j = start; j < end; j++) {
                this._trails[j].update(elapsed);
                this._objects[j].x = elapsed * 0.5 + start * 10;
                this._objects[j].y = (j - start) * 35 + Math.sin(elapsed * 0.005) * 100;
            }
        }
    }
}
