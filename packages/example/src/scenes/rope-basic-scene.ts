/* eslint-disable @typescript-eslint/naming-convention */
import { RopeComponent, TrailMaterial } from '@armathai/pixi-trail';
import { Point, Texture } from 'pixi.js';
import letters from '../../assets/letters.png';
import { SceneAbstract } from './scene-abstract';

export class RopeBasicScene extends SceneAbstract {
    private _rope: RopeComponent;

    public constructor() {
        super();

        const rope = new RopeComponent(
            [
                //
                new Point(20, 100),
                new Point(130, 220),
                new Point(270, 130),
                new Point(370, 110),
                new Point(440, 160),
            ],
            new TrailMaterial(Texture.from(letters)),
            50
        );
        this.addChild((this._rope = rope));
        rope.setDebugger(true);
    }

    public update(elapsed: number): void {
        this._rope.update(elapsed);
    }
}
