/* eslint-disable @typescript-eslint/naming-convention */
import { TrailComponent } from '@armathai/pixi-trail';
import { Container, Ticker } from 'pixi.js';

export class TrailPerformanceScene extends Container {
    private _trails: Array<TrailComponent> = [];
    private _objects: Array<Container> = [];

    public constructor() {
        super();

        this.scale.set(0.2);
        const count = 200;
        const colsCount = 2;

        // Create
        for (let i = 0; i < count; i++) {
            const ball = new Container();
            this.addChild(ball);
            ball.y = 22;
            ball.x = -70;

            const trail = new TrailComponent({
                sharpness: true,
                trailWidth: 30,
                lifeSpan: 400,
                minimalSquareDistance: 10,
                material: {
                    latitudeColorA: '#ffffff',
                    a_latitudeColorA: 1,
                    latitudeColorB: '#ffffff',
                    a_latitudeColorB: 1,
                    longitudeColorA: '#ffffff',
                    a_longitudeColorA: 1,
                    longitudeColorB: '#ffffff',
                    a_longitudeColorB: 1,
                    colorStart: 0.0,
                    colorEnd: 1.0,
                    offset: 0.5,
                    linesCount: 1.0,
                    longitudeAlphaIntensity: 0.0,
                    latitudeAlphaIntensity: 0.0,
                    rough: false,
                    colorsProportions: 0.5,
                },
            });

            this.addChild(trail);
            trail.attachObject(ball);

            this._trails.push(trail);
            this._objects.push(ball);
        }
        // ..........

        // Update
        const ticker = Ticker.shared;
        ticker.add(() => {
            this.x = -this._objects[0].x * this.scale.x + 250;
            const time = ticker.lastTime;

            for (let i = 0; i < colsCount; i++) {
                const start = i * Math.floor(count / colsCount);
                const end = start + Math.floor(count / colsCount);

                for (let j = start; j < end; j++) {
                    this._trails[j].update(time);
                    this._objects[j].x = time * 0.5 + start * 10;
                    this._objects[j].y = (j - start) * 35 + Math.sin(time * 0.005) * 100;
                }
            }
        });
        // ..........
    }
}
