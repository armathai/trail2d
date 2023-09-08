import { Graphics, IPoint, Mesh, MeshMaterial, Point, Renderer } from 'pixi.js';
import { TrailGeometry } from './trail-geometry';

/**
 * The rope allows you to draw a texture across several points and then manipulate these points
 */
export class RopeComponent extends Mesh {
    public autoUpdate: boolean;
    protected points: IPoint[];
    protected debugGr!: Graphics | null;

    /**
     * @param points - An array of {@link PIXI.Point} objects to construct this rope.
     * @param meshMaterial - The material to use on the rope.
     * @param ropeWidth - The width of rope.
     */
    public constructor(points: IPoint[], meshMaterial: MeshMaterial) {
        super(new TrailGeometry(points), meshMaterial);
        this.points = (<TrailGeometry>this.geometry).points;
        // this.drawMode = DRAW_MODES.LINE_STRIP;

        this.shader.uniforms['uNodesCount'] = this.points.length - 1;

        /**
         * re-calculate vertices by rope points each frame
         *
         * @member {boolean}
         */
        this.autoUpdate = true;
    }

    public addPoint(point: IPoint): void {
        (<TrailGeometry>this.geometry).addPoint(new Point().copyFrom(point));
        this.shader.uniforms['uNodesCount'] = this.points.length - 1;
    }

    public update(elapsed = 0): void {
        void elapsed;
        // ........................

        // Debug rendering
        if (this.debugGr) {
            this.renderPointsDebug();
        }
        // ........................
    }

    public setDebugger(value: boolean): void {
        if (value) {
            if (!this.debugGr) {
                this.debugGr = new Graphics();
                this.addChild(this.debugGr);
            }
        } else {
            this.debugGr && this.removeChild(this.debugGr);
            this.debugGr = null;
        }
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    protected _render(renderer: Renderer): void {
        const geometry: TrailGeometry = <TrailGeometry>this.geometry;
        this.autoUpdate && geometry.update();

        super._render(renderer);
    }

    protected renderPointsDebug(): void {
        this.debugGr?.clear();
        this.debugGr?.lineStyle(2, 0xffc2c2);
        this.debugGr?.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            this.debugGr?.lineTo(this.points[i].x, this.points[i].y);
        }
        for (let i = 0; i < this.points.length; i++) {
            this.debugGr?.beginFill(0xff0022);
            this.debugGr?.drawCircle(this.points[i].x, this.points[i].y, 5);
            this.debugGr?.endFill();
        }
    }
}
