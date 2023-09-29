/* eslint-disable @typescript-eslint/naming-convention */
import { Color, MeshMaterial, Program, Texture } from 'pixi.js';
import { TRAIL_CUSTOMIZABLE_FRAGMENT_SHADER, TRAIL_DEFAULT_VERTEX_SHADER } from '../shaders/shaders';
import { TrailMaterialConfig } from '../types';

export class TrailCustomizableMaterial extends MeshMaterial {
    public constructor(config: TrailMaterialConfig) {
        const {
            rough,
            latitudeColorA,
            a_latitudeColorA,
            latitudeColorB,
            a_latitudeColorB,
            longitudeColorA,
            a_longitudeColorA,
            longitudeColorB,
            a_longitudeColorB,
            colorStart,
            colorEnd,
            offset,
            linesCount,
            longitudeAlphaIntensity,
            latitudeAlphaIntensity,
            colorsProportions,
        } = config;

        const uniforms = {
            uAlpha: 1,
            uTint: new Float32Array([...new Color(0xffffff).toRgbArray(), 1]),

            rough,
            latitudeColorA: new Float32Array([...new Color(latitudeColorA).toRgbArray(), a_latitudeColorA]),
            latitudeColorB: new Float32Array([...new Color(latitudeColorB).toRgbArray(), a_latitudeColorB]),
            longitudeColorA: new Float32Array([...new Color(longitudeColorA).toRgbArray(), a_longitudeColorA]),
            longitudeColorB: new Float32Array([...new Color(longitudeColorB).toRgbArray(), a_longitudeColorB]),

            colorStart,
            colorEnd,
            offset,
            linesCount,
            longitudeAlphaIntensity,
            latitudeAlphaIntensity,
            colorsProportions,
        };

        super(Texture.WHITE, {
            uniforms,
            program: new Program(TRAIL_DEFAULT_VERTEX_SHADER, TRAIL_CUSTOMIZABLE_FRAGMENT_SHADER),
        });
    }
}
