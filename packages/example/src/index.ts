import { Application, Container, Ticker } from 'pixi.js';
import Stats from 'stats.js';
import { RopeBasicScene } from './scenes/rope-basic-scene';
import { SceneAbstract } from './scenes/scene-abstract';
import { TrailBasicScene } from './scenes/trail-basic-scene';
import { TrailCustomizableMaterialScene } from './scenes/trail-customizable-material-scene';
import { TrailFollowMouseScene } from './scenes/trail-follow-mouse-scene';
import { TrailPerformanceScene } from './scenes/trail-performance-scene';

class Game extends Application<HTMLCanvasElement> {
    public constructor() {
        super({ resizeTo: window, backgroundColor: 0x000000, hello: true });
        this.ticker.maxFPS = 60;
    }
}

window.addEventListener('load', () => {
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    const game = new Game();
    document.body.appendChild(game.view);
    window.game = game;

    let scene: Container;
    let exampleName: string;

    exampleName = 'customMaterial';
    exampleName = 'mouseFollowing';
    exampleName = 'performance';
    exampleName = 'rope';
    exampleName = 'simpleTrail';

    switch (exampleName) {
        case 'rope':
            scene = new RopeBasicScene();
            break;
        case 'simpleTrail':
            scene = new TrailBasicScene();
            break;
        case 'customMaterial':
            scene = new TrailCustomizableMaterialScene();
            break;
        case 'performance':
            scene = new TrailPerformanceScene();
            break;
        case 'mouseFollowing':
            scene = new TrailFollowMouseScene();
            break;

        default:
            break;
    }

    game.stage.addChild(scene);

    const ticker = Ticker.shared;
    ticker.add(() => {
        (scene as SceneAbstract).update(ticker.lastTime);
    });
});
