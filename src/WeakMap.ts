/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-16
*************************************************/
/// <reference path="./HashMap.ts" />

namespace shim {
    export interface BufferLike {
        [offset: number]: number;
        length: number;
    }
    export interface WeakMap<K, V> {
        clear(): void;
        delete(key: K): boolean;
        get(key: K): V;
        has(key: K): boolean;
        set(key: K, value?: V): WeakMap<K, V>;
    }

    export interface WeakMapConstructor {
        new(): WeakMap<any, any>;
        new <K, V>(): WeakMap<K, V>;
        prototype: WeakMap<any, any>;
    }
    function CreateWeakMapPolyfill(): WeakMapConstructor {
        const UUID_SIZE = 16;
        const keys = _HashMap.create<boolean>();
        const rootKey = CreateUniqueKey();
        return class WeakMap<K, V> {
            private _key = CreateUniqueKey();
            has(target: K): boolean {
                const table = GetOrCreateWeakMapTable<K>(target, /*create*/ false);
                return table !== undefined ? _HashMap.has(table, this._key) : false;
            }
            get(target: K): V {
                const table = GetOrCreateWeakMapTable<K>(target, /*create*/ false);
                return table !== undefined ? _HashMap.get(table, this._key) : undefined;
            }
            set(target: K, value: V): WeakMap<K, V> {
                const table = GetOrCreateWeakMapTable<K>(target, /*create*/ true);
                table[this._key] = value;
                return this;
            }
            delete(target: K): boolean {
                const table = GetOrCreateWeakMapTable<K>(target, /*create*/ false);
                return table !== undefined ? delete table[this._key] : false;
            }
            clear(): void {
                // NOTE: not a real clear, just makes the previous data unreachable
                this._key = CreateUniqueKey();
            }
        };

        function CreateUniqueKey(): string {
            let key: string;
            do key = "@@WeakMap@@" + CreateUUID();
            while (_HashMap.has(keys, key));
            keys[key] = true;
            return key;
        }

        function GetOrCreateWeakMapTable<K>(target: K, create: true): HashMap<any>;
        function GetOrCreateWeakMapTable<K>(target: K, create: false): HashMap<any> | undefined;
        function GetOrCreateWeakMapTable<K>(target: K, create: boolean): HashMap<any> | undefined {
            if (!hasOwnProperty.call(target, rootKey)) {
                if (!create) return undefined;
                Object.defineProperty(target, rootKey, { value: _HashMap.create<any>() });
            }
            return (<any>target)[rootKey];
        }

        function FillRandomBytes(buffer: BufferLike, size: number): BufferLike {
            for (let i = 0; i < size; ++i) buffer[i] = Math.random() * 0xff | 0;
            return buffer;
        }

        function GenRandomBytes(size: number): BufferLike {
            if (typeof Uint8Array === "function") {
                return FillRandomBytes(new Uint8Array(size), size);
            }
            return FillRandomBytes(new Array(size), size);
        }

        function CreateUUID() {
            const data = GenRandomBytes(UUID_SIZE);
            // mark as random - RFC 4122 § 4.4
            data[6] = data[6] & 0x4f | 0x40;
            data[8] = data[8] & 0xbf | 0x80;
            let result = "";
            for (let offset = 0; offset < UUID_SIZE; ++offset) {
                const byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8) result += "-";
                if (byte < 16) result += "0";
                result += byte.toString(16).toLowerCase();
            }
            return result;
        }
    }
    export const WeakMapShim = CreateWeakMapPolyfill();
}