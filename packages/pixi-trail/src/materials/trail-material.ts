/* eslint-disable @typescript-eslint/naming-convention */
import { Color, MeshMaterial, Program, Texture } from 'pixi.js';
import { TRAIL_DEFAULT_FRAGMENT_SHADER, TRAIL_DEFAULT_VERTEX_SHADER } from '../shaders/shaders';

export class TrailMaterial extends MeshMaterial {
    public constructor(
        texture: Texture = Texture.WHITE,
        vertex: string = TRAIL_DEFAULT_VERTEX_SHADER,
        fragment: string = TRAIL_DEFAULT_FRAGMENT_SHADER
    ) {
        super(texture, {
            program: Program.from(vertex, fragment),
            uniforms: { uAlpha: 1, uTint: new Float32Array([...new Color(0xffffff).toRgbArray(), 1]) },
        });
    }
}
