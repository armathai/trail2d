/* eslint-disable @typescript-eslint/naming-convention */
import { RopeComponent, TrailMaterial } from '@armathai/pixi-trail';
import { Container, Point, Ticker } from 'pixi.js';

export class RopeBasicScene extends Container {
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
            new TrailMaterial(
                {
                    latitudeColorA: '#ff0000',
                    a_latitudeColorA: 1,
                    latitudeColorB: '#0000ff',
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
                },
                50,
                false
            )
        );
        this.addChild(rope);
        rope.setDebugger(true);

        const ticker = Ticker.shared;
        ticker.add(() => {
            rope.update();
        });
    }
}
