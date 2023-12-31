/* eslint-disable @typescript-eslint/naming-convention */
import { TrailComponent, TrailMaterial } from '@armathai/pixi-trail';
import { Container, Texture } from 'pixi.js';
import stripes from '../../assets/letters.png';
import { SceneAbstract } from './scene-abstract';

export class TrailBasicScene extends SceneAbstract {
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
            new TrailMaterial(Texture.from(stripes))
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
