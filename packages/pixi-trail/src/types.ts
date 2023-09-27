/* eslint-disable @typescript-eslint/naming-convention */
export interface IDisplayObjectLike {
    position: import('pixi.js').IPoint;
}

export type TrailConfig = {
    trailWidth: number;
    lifeSpan: number;
    minimalSquareDistance: number;
    sharpness: boolean;
};

export type TrailMaterialConfig = {
    rough: boolean;
    latitudeColorA: string;
    a_latitudeColorA: number;
    latitudeColorB: string;
    a_latitudeColorB: number;
    longitudeColorA: string;
    a_longitudeColorA: number;
    longitudeColorB: string;
    a_longitudeColorB: number;
    colorStart: number;
    colorEnd: number;
    offset: number;
    linesCount: number;
    longitudeAlphaIntensity: number;
    latitudeAlphaIntensity: number;
    colorsProportions: number;
};

export type TypedPoolParameters<K, V> = {
    constructorFn: (id: K, ...rest: unknown[]) => V;
    destructorFn: (child: V) => void;
    resetFn: (child: V) => void;
};

export type SimplePoolParameters<V> = {
    constructorFn: (...args: unknown[]) => V;
    destructorFn: (child: V) => void;
    resetFn: (child: V) => void;
};
