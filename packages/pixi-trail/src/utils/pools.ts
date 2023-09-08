import { SimplePoolParameters, TypedPoolParameters } from '../types';

export class TypedPool<K, V> {
    protected pool: Map<K, V[]> = new Map();
    protected params: TypedPoolParameters<K, V>;

    public constructor(params: TypedPoolParameters<K, V>) {
        this.params = params;
    }

    public recycle(): void {
        this.pool.forEach((value) => value.forEach((v) => this.params.destructorFn(v)));
        this.pool.clear();
    }

    public reserve(id: K, ...rest: unknown[]): void {
        const obj = this.params.constructorFn(id, rest);
        this.params.resetFn(obj);

        this.placeInPool(id, obj);
    }

    public spawn(id: K, ...rest: unknown[]): V | undefined {
        const objArr = this.pool.get(id);

        return !objArr?.length //
            ? this.params.constructorFn(id, rest)
            : objArr.pop();
    }

    public despawn(id: K, obj: V): void {
        this.params.resetFn(obj);

        this.placeInPool(id, obj);
    }

    protected placeInPool(id: K, obj: V): void {
        if (this.pool.has(id)) {
            this.pool.get(id)?.push(obj);
        } else {
            this.pool.set(id, [obj]);
        }
    }
}

export class SimplePool<V> {
    protected pool: Array<V> = [];
    protected params: SimplePoolParameters<V>;

    public constructor(params: SimplePoolParameters<V>) {
        this.params = params;
    }

    public recycle(): void {
        this.pool.forEach((el) => this.params.destructorFn(el));
        this.pool.length = 0;
    }

    public reserve(...args: unknown[]): void {
        const obj = this.params.constructorFn(...args);
        this.params.resetFn(obj);

        this.placeInPool(obj);
    }

    public spawn(...args: unknown[]): V | undefined {
        return !this.pool.length //
            ? this.params.constructorFn(...args)
            : this.pool.pop();
    }

    public despawn(obj: V): void {
        this.params.resetFn(obj);

        this.placeInPool(obj);
    }

    protected placeInPool(obj: V): void {
        this.pool.push(obj);
    }
}

export class LimitedSimplePool<V> extends SimplePool<V> {
    public spawn(..._args: unknown[]): V | undefined {
        return !this.pool.length //
            ? undefined
            : this.pool.pop();
    }
}

export class LimitedTypedPool<K, V> extends TypedPool<K, V> {
    public spawn(id: K): V | undefined {
        const objArr = this.pool.get(id);

        return !objArr?.length //
            ? undefined
            : objArr.pop();
    }
}
