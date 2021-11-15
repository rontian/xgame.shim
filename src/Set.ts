/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-16
*************************************************/
namespace shim {
    export interface Set<T> extends Iterable<T> {
        size: number;
        has(value: T): boolean;
        add(value: T): this;
        delete(value: T): boolean;
        clear(): void;
        keys(): IterableIterator<T>;
        values(): IterableIterator<T>;
        entries(): IterableIterator<[T, T]>;
    }

    export interface SetConstructor {
        new(): Set<any>;
        new <T>(): Set<T>;
        prototype: Set<any>;
    }
    function CreateSetPolyfill(): SetConstructor {
        return class Set<T> {
            private _map = new MapShim<any, any>();
            get size() { return this._map.size; }
            has(value: T): boolean { return this._map.has(value); }
            add(value: T): Set<T> { return this._map.set(value, value), this; }
            delete(value: T): boolean { return this._map.delete(value); }
            clear(): void { this._map.clear(); }
            keys() { return this._map.keys(); }
            values() { return this._map.values(); }
            entries() { return this._map.entries(); }
            "@@iterator"() { return this.keys(); }
            [iteratorSymbol]() { return this.keys(); }
        };
    }
    export const SetShim = CreateSetPolyfill();
}