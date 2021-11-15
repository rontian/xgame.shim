/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-16
*************************************************/
declare namespace shim {
    type IteratorResult<T> = {
        value: T;
        done: false;
    } | {
        value: never;
        done: true;
    };
    interface Iterator<T> {
        next(value?: any): IteratorResult<T>;
        throw?(value: any): IteratorResult<T>;
        return?(value?: T): IteratorResult<T>;
    }
    interface Iterable<T> {
        "@@iterator"(): Iterator<T>;
    }
    interface IterableIterator<T> extends Iterator<T> {
        "@@iterator"(): IterableIterator<T>;
    }
    const hasOwnProperty: {
        (v: PropertyKey): boolean;
        (v: string): boolean;
    };
    const supportsSymbol: boolean;
    const iteratorSymbol: any;
    const toPrimitiveSymbol: any;
    const supportsCreate: boolean;
    const supportsProto: boolean;
    const downLevel: boolean;
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-16
*************************************************/
declare namespace shim {
    type HashMap<V> = Record<string, V>;
    const _HashMap: {
        create: <V>() => Record<string, V>;
        has: <V>(map: Record<string, V>, key: PropertyKey) => any;
        get: <V>(map: Record<string, V>, key: PropertyKey) => V;
    };
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-16
*************************************************/
declare namespace shim {
    interface Map<K, V> extends Iterable<[K, V]> {
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
    interface MapConstructor {
        new (): Map<any, any>;
        new <K, V>(): Map<K, V>;
        prototype: Map<any, any>;
    }
    const MapShim: MapConstructor;
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-16
*************************************************/
declare namespace shim {
    interface Set<T> extends Iterable<T> {
        size: number;
        has(value: T): boolean;
        add(value: T): this;
        delete(value: T): boolean;
        clear(): void;
        keys(): IterableIterator<T>;
        values(): IterableIterator<T>;
        entries(): IterableIterator<[T, T]>;
    }
    interface SetConstructor {
        new (): Set<any>;
        new <T>(): Set<T>;
        prototype: Set<any>;
    }
    const SetShim: SetConstructor;
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-16
*************************************************/
declare namespace shim {
    interface BufferLike {
        [offset: number]: number;
        length: number;
    }
    interface WeakMap<K, V> {
        clear(): void;
        delete(key: K): boolean;
        get(key: K): V;
        has(key: K): boolean;
        set(key: K, value?: V): WeakMap<K, V>;
    }
    interface WeakMapConstructor {
        new (): WeakMap<any, any>;
        new <K, V>(): WeakMap<K, V>;
        prototype: WeakMap<any, any>;
    }
    const WeakMapShim: WeakMapConstructor;
}
