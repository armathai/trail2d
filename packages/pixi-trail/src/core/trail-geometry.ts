import type { IPoint } from '@pixi/math';
import { MeshGeometry } from 'pixi.js';

export class TrailGeometry extends MeshGeometry {
    public readonly textureScale!: number;

    public points: IPoint[];

    public constructor(points: IPoint[], _textureScale?: number) {
        super(
            new Float32Array(points.length * 4),
            new Float32Array(points.length * 4),
            new Uint16Array((points.length - 1) * 6)
        );
        this.points = points;

        this._build();
        this.updateAttributes();
    }

    public update(): void {
        //
    }

    public addPoint(point: IPoint): void {
        this.points.push(point);
        this.updateAttributes();
    }

    public updatePoints(points: IPoint[]): void {
        this.points = points;
        this.updateAttributes();
    }

    public updateAttributes(): void {
        if (this.points.length < 2) {
            return;
        }

        const points = this.points;
        const { length } = points;

        const vertexBuffer = this.getBuffer('aVertexPosition');
        const dataBuffer = this.getBuffer('aVertexData');
        const indexBuffer = this.getIndex();
        const idBuffer = this.getBuffer('aVertexId');
        const uvBuffer = this.getBuffer('aTextureCoord');

        const verticesData = new Float32Array(length * 4);
        const data = new Float32Array(length * 8);
        const indicesData = new Uint32Array((length - 1) * 6);
        const idsData = new Float32Array(length * 2);
        const uvsData = new Float32Array(length * 4);

        for (let i = 0; i < points.length; i++) {
            // UVs
            const uv = i / (points.length - 1);

            uvsData[i * 4] = uv;
            uvsData[i * 4 + 1] = 0;
            uvsData[i * 4 + 2] = uv;
            uvsData[i * 4 + 3] = 1;

            // Vertices Buffer
            verticesData[i * 4] = points[i].x;
            verticesData[i * 4 + 1] = points[i].y;
            verticesData[i * 4 + 2] = points[i].x;
            verticesData[i * 4 + 3] = points[i].y;

            // Ids buffer
            idsData[i * 2] = i * 2;
            idsData[i * 2 + 1] = i * 2 + 1;

            // Data buffer (stores previousPoint and nextPoint)
            data[i * 8 + 0] = points[i - 1] ? points[i - 1].x : points[i + 1].x;
            data[i * 8 + 1] = points[i - 1] ? points[i - 1].y : points[i + 1].y;
            data[i * 8 + 4] = points[i - 1] ? points[i - 1].x : points[i + 1].x;
            data[i * 8 + 5] = points[i - 1] ? points[i - 1].y : points[i + 1].y;

            data[i * 8 + 2] = points[i + 1] ? points[i + 1].x : points[i - 1].x;
            data[i * 8 + 3] = points[i + 1] ? points[i + 1].y : points[i - 1].y;
            data[i * 8 + 6] = points[i + 1] ? points[i + 1].x : points[i - 1].x;
            data[i * 8 + 7] = points[i + 1] ? points[i + 1].y : points[i - 1].y;

            // Indices buffer
            // if (i !== 0) {
            const c = i * 2;
            const b = c - 1;
            const a = b - 1;

            const f = i * 2 + 1;
            const e = f - 1;
            const d = e - 1;

            indicesData[(i - 1) * 6] = a;
            indicesData[(i - 1) * 6 + 1] = b;
            indicesData[(i - 1) * 6 + 2] = c;
            indicesData[(i - 1) * 6 + 3] = e;
            indicesData[(i - 1) * 6 + 4] = d;
            indicesData[(i - 1) * 6 + 5] = f;
            // }
        }

        vertexBuffer.update(verticesData);
        indexBuffer.update(indicesData);
        uvBuffer.update(uvsData);
        idBuffer.update(idsData);
        dataBuffer.update(data);
    }

    private _build(): void {
        this.addAttribute('aVertexId', new Float32Array(this.points.length * 2), 1);
        this.addAttribute('aVertexData', new Float32Array(this.points.length * 4 * 2), 4);
    }
}
