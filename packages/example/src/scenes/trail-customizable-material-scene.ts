/* eslint-disable @typescript-eslint/naming-convention */
import { TrailComponent, TrailCustomizableMaterial } from '@armathai/pixi-trail';
import { Container } from 'pixi.js';
import { SceneAbstract } from './scene-abstract';

export class TrailCustomizableMaterialScene extends SceneAbstract {
    private _trail: TrailComponent;
    private _ball: Container;

    public constructor() {
        super();

        const ball = new Container();
        this.addChild((this._ball = ball));
        ball.y = 22;
        ball.x = -70;

        const trail = new TrailComponent(
            {
                trailWidth: 30,
                lifeSpan: 400,
                minimalSquareDistance: 10,
                sharpness: false,
            },
            new TrailCustomizableMaterial({
                latitudeColorA: '#ff0000',
                a_latitudeColorA: 1,
                latitudeColorB: '#fff000',
                a_latitudeColorB: 1,
                longitudeColorA: '#ffffff',
                a_longitudeColorA: 1,
                longitudeColorB: '#ffffff',
                a_longitudeColorB: 0,
                colorStart: 0.0,
                colorEnd: 1.0,
                offset: 0.5,
                linesCount: 1.0,
                longitudeAlphaIntensity: 0.0,
                latitudeAlphaIntensity: 0.0,
                rough: true,
                colorsProportions: 0.5,
            })
        );
        this.addChild((this._trail = trail));
        // trail.setDebugger(true);
        setTimeout(() => {
            trail.attachObject(ball);
        }, 100);
    }

    public update(elapsed: number): void {
        this.x = -this._ball.x * this.scale.x + 400;
        this._trail.update(elapsed);
        this._ball.x = -70 + elapsed * 0.5;
        this._ball.y = 300 + Math.sin(elapsed * 0.005) * 100;
    }
}
