/* eslint-disable @typescript-eslint/naming-convention */
import { Color, MeshMaterial, Program, Texture } from 'pixi.js';
import { fragment, vertex } from '../shaders/shaders';
import { TrailMaterialConfig } from '../types';

export class TrailMaterial extends MeshMaterial {
    public constructor(config: TrailMaterialConfig, trailWidth: number, sharpness: boolean) {
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
            uTrailWidth: trailWidth,
            uSharpness: sharpness,
        };

        super(Texture.WHITE, {
            program: new Program(vertex, fragment),
            uniforms,
        });
    }
}
