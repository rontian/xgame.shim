/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-16
*************************************************/
namespace shim {

    export interface Map<K, V> extends Iterable<[K, V]> {
        size: number;
        has(key: K): boolean;
        get(key: K): V;
        set(key: K, value?: V): this;
        delete(key: K): boolean;
        clear(): void;
        keys(): IterableIterator<K>;
        values(): IterableIterator<V>;
        entries(): IterableIterator<[K, V]>;
        forEach(callback: (value: V, key: K, map: Map<K, V>) => any): void;
    }

    export interface MapConstructor {
        new(): Map<any, any>;
        new <K, V>(): Map<K, V>;
        prototype: Map<any, any>;
    }
    

    function CreateMapPolyfill(): MapConstructor {
        const cacheSentinel = {};
        const arraySentinel: any[] = [];

        class MapIterator<K, V, R extends (K | V | [K, V])> implements IterableIterator<R> {
            private _keys: K[];
            private _values: V[];
            private _index = 0;
            private _selector: (key: K, value: V) => R;
            constructor(keys: K[], values: V[], selector: (key: K, value: V) => R) {
                this._keys = keys;
                this._values = values;
                this._selector = selector;
            }
            "@@iterator"() { return this; }
            [iteratorSymbol]() { return this; }
            next(): IteratorResult<R> {
                const index = this._index;
                if (index >= 0 && index < this._keys.length) {
                    const result = this._selector(this._keys[index], this._values[index]);
                    if (index + 1 >= this._keys.length) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    else {
                        this._index++;
                    }
                    return { value: result, done: false };
                }
                return { value: <never>undefined, done: true };
            }
            throw(error: any): IteratorResult<R> {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                throw error;
            }
            return(value?: R): IteratorResult<R> {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                return { value: <never>value, done: true };
            }
        }

        return class Map<K, V> {
            private _keys: K[] = [];
            private _values: (V | undefined)[] = [];
            private _cacheKey = cacheSentinel;
            private _cacheIndex = -2;
            get size() { return this._keys.length; }
            has(key: K): boolean { return this._find(key, /*insert*/ false) >= 0; }
            get(key: K): V | undefined {
                const index = this._find(key, /*insert*/ false);
                return index >= 0 ? this._values[index] : undefined;
            }
            set(key: K, value: V): this {
                const index = this._find(key, /*insert*/ true);
                this._values[index] = value;
                return this;
            }
            delete(key: K): boolean {
                const index = this._find(key, /*insert*/ false);
                if (index >= 0) {
                    const size = this._keys.length;
                    for (let i = index + 1; i < size; i++) {
                        this._keys[i - 1] = this._keys[i];
                        this._values[i - 1] = this._values[i];
                    }
                    this._keys.length--;
                    this._values.length--;
                    if (key === this._cacheKey) {
                        this._cacheKey = cacheSentinel;
                        this._cacheIndex = -2;
                    }
                    return true;
                }
                return false;
            }
            clear(): void {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            }
            keys() { return new MapIterator(this._keys, this._values, getKey); }
            values() { return new MapIterator(this._keys, this._values, getValue); }
            entries() { return new MapIterator(this._keys, this._values, getEntry); }
            "@@iterator"() { return this.entries(); }
            [iteratorSymbol]() { return this.entries(); }
            private _find(key: K, insert?: boolean): number {
                if (this._cacheKey !== key) {
                    this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                }
                if (this._cacheIndex < 0 && insert) {
                    this._cacheIndex = this._keys.length;
                    this._keys.push(key);
                    this._values.push(undefined);
                }
                return this._cacheIndex;
            }
            forEach(callback: (v: V, k: K, map: Map<K, V>) => void): void {
                let iterator = this.entries();
                let r: IteratorResult<[K, V]>;
                while (r = iterator.next()) {
                    callback(r[1], r[0], this);
                }
            }
        };

        function getKey<K, V>(key: K, _: V) {
            return key;
        }

        function getValue<K, V>(_: K, value: V) {
            return value;
        }

        function getEntry<K, V>(key: K, value: V) {
            return [key, value] as [K, V];
        }
    }
    export const MapShim = CreateMapPolyfill();
}