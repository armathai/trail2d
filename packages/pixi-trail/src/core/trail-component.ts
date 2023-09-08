import { DisplayObjectEvents, IPoint, MeshMaterial, Point } from 'pixi.js';
import { IDisplayObjectLike, TrailConfig } from '../types';
import { getSquareDistanceBetweenPoints } from '../utils';
import { SimplePool } from '../utils/pools';
import { RopeComponent } from './rope-component';
import { TrailGeometry } from './trail-geometry';
import { TrailMaterial } from './trail-material';

export class TrailComponent extends RopeComponent {
    public static readonly onCollapsed: string = 'onCollapsed';

    private _object!: IDisplayObjectLike | null;
    private _times: number[] = [];
    private _pool!: SimplePool<IPoint>;
    private _objectLastPosition!: IPoint;

    private _lifeSpan: number;
    private _minimalSquareDistance: number;

    public constructor(config: TrailConfig) {
        const { lifeSpan, minimalSquareDistance, sharpness, trailWidth, material } = config;

        super([new Point(0, 0)], new TrailMaterial(material, trailWidth, sharpness));

        this._lifeSpan = lifeSpan;
        this._minimalSquareDistance = minimalSquareDistance;

        this._initPool();
    }

    public get lifeSpan(): number {
        return this._lifeSpan;
    }

    public set lifeSpan(value: number) {
        this._lifeSpan = value;
    }

    public get minimalSquareDistance(): number {
        return this._minimalSquareDistance;
    }

    public set minimalSquareDistance(value: number) {
        this._minimalSquareDistance = value;
    }

    public update(elapsed: number): void {
        // Check for add points
        if (this._object && this.points.length >= 2) {
            const { position } = this._object;
            const lastPoint = this.points[this.points.length - 1];
            const preLastPoint = this.points[this.points.length - 2];

            const sqDist = getSquareDistanceBetweenPoints(this._object.position, preLastPoint);

            if (sqDist > this._minimalSquareDistance) {
                this._addPoint(position, elapsed);
            } else {
                lastPoint.x = position.x;
                lastPoint.y = position.y;
                this._updateGeometry();
            }
        }
        // ........................

        // Check for remove points
        for (let i = 0; i < this._times.length; i++) {
            if (this._times[i] + this._lifeSpan < elapsed) {
                this._removePoints(i - 1);
            }
        }
        // ........................

        // Custom logic for this game...
        if (this._object == null && this._objectLastPosition != null) {
            if (this.points.length <= 3) {
                this.emit(TrailComponent.onCollapsed as keyof DisplayObjectEvents);
            }
        }

        super.update(elapsed);
    }

    public attachObject(object: IDisplayObjectLike): void {
        this._object = object;

        this._resetPoints();
        this._addPoint(this._object.position, 0);
        this._addPoint(this._object.position, 0);
    }

    public detachObject(): IDisplayObjectLike | null {
        let obj = null;

        if (this._object) {
            obj = this._object;
            const { x, y } = obj.position;
            this._objectLastPosition = new Point(x, y);

            this._object = null;
        }

        return obj;
    }

    public setMaterial(material: MeshMaterial): void {
        this.shader = material;
    }

    private _resetPoints(): void {
        this.points.length = 0;
        this._times.length = 0;
    }

    private _initPool(): void {
        this._pool = new SimplePool({
            constructorFn: this._constructPoint,
            destructorFn: this._destructPoint,
            resetFn: this._resetPoint,
        });
    }

    private _constructPoint = (): IPoint => {
        return new Point(0, 0);
    };

    private _destructPoint = (_point: IPoint): void => {
        //
    };

    private _resetPoint = (_point: IPoint): void => {
        // point.x = 0;
        // point.y = 0;
    };

    private _addPoint(point: IPoint, elapsed: number): void {
        const { x, y } = point;
        const p = this._pool.spawn()!;
        p.x = x;
        p.y = y;

        this.points.push(p);
        this._times.push(elapsed);

        this._updateGeometry();
    }

    private _removePoint(index: number): void {
        const points = this.points.splice(index, 1);
        this._times.splice(index, 1);
        this._pool.despawn(points[0]);

        this._updateGeometry();
    }

    private _removePoints(index: number): void {
        const removedPoints = this.points.splice(0, index);
        this._times.splice(0, index);
        removedPoints.forEach((p) => {
            this._pool.despawn(p);
        });

        this._updateGeometry();
    }

    private _updateGeometry(): void {
        (<TrailGeometry>this.geometry).updateAttributes();
        this.shader.uniforms['uNodesCount'] = this.points.length - 1;
    }
}
