import { Container } from 'pixi.js';

export abstract class SceneAbstract extends Container {
    public abstract update(elapsed: number): void;
}
