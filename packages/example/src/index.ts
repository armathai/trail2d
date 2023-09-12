import { Application } from 'pixi.js';
import Stats from 'stats.js';
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
    game.stage.addChild(new TrailPerformanceScene());
});
