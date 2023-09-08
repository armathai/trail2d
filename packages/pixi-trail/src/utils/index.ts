import { IPoint } from 'pixi.js';

export const getSquareDistanceBetweenPoints = (point1: IPoint, point2: IPoint): number => {
    const { x: x1, y: y1 } = point1;
    const { x: x2, y: y2 } = point2;

    const dX = x2 - x1;
    const dY = y2 - y1;

    return dX * dX + dY * dY;
};
