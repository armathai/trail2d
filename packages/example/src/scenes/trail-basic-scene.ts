/* eslint-disable @typescript-eslint/naming-convention */
import { TrailComponent } from '@armathai/pixi-trail';
import { Container, Ticker } from 'pixi.js';

export class TrailBasicScene extends Container {
    public constructor() {
        super();

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
        // trail.setDebugger(true);
        trail.attachObject(ball);

        const ticker = Ticker.shared;
        ticker.add(() => {
            this.x = -ball.x * this.scale.x + 400;
            const time = ticker.lastTime;
            trail.update(time);
            ball.x = -70 + time * 0.5;
            ball.y = 300 + Math.sin(time * 0.005) * 100;
        });
    }
}
