/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-16
*************************************************/
namespace shim {
    export type IteratorResult<T> = { value: T, done: false } | { value: never, done: true };

    export interface Iterator<T> {
        next(value?: any): IteratorResult<T>;
        throw?(value: any): IteratorResult<T>;
        return?(value?: T): IteratorResult<T>;
    }

    export interface Iterable<T> {
        "@@iterator"(): Iterator<T>;
    }

    export interface IterableIterator<T> extends Iterator<T> {
        "@@iterator"(): IterableIterator<T>;
    }

    export const hasOwnProperty = Object.prototype.hasOwnProperty;
    export const supportsSymbol = typeof Symbol === "function";
    export const iteratorSymbol = supportsSymbol && typeof (Symbol as any).iterator !== "undefined" ? (Symbol as any).iterator : "@@iterator";
    export const toPrimitiveSymbol = supportsSymbol && typeof (Symbol as any).toPrimitive !== "undefined" ? (Symbol as any).toPrimitive : "@@toPrimitive";
    export const supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
    export const supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
    export const downLevel = !supportsCreate && !supportsProto;
}