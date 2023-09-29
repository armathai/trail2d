/* eslint-disable @typescript-eslint/naming-convention */
import { TrailComponent, TrailMaterial } from '@armathai/pixi-trail';
import { Container, FederatedPointerEvent, Texture } from 'pixi.js';
import stripes from '../../assets/letters.png';
import { SceneAbstract } from './scene-abstract';

export class TrailFollowMouseScene extends SceneAbstract {
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

        const { game } = window;
        game.stage.eventMode = 'static';
        game.stage.hitArea = game.screen;
        game.stage.addEventListener('pointermove', this._onPointerMove);
    }

    public update(elapsed: number): void {
        this._trail.update(elapsed);
    }

    private _onPointerMove = (e: FederatedPointerEvent): void => {
        const { x, y } = e.global;
        this._ball.position.set(x, y);
    };
}
