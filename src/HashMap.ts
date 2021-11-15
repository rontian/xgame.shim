/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-16
*************************************************/
/// <reference path="./interfaces.ts" />

namespace shim {
    export type HashMap<V> = Record<string, V>;
    export const _HashMap = {
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        create: supportsCreate
            ? <V>() => MakeDictionary(Object.create(null) as HashMap<V>)
            : supportsProto
                ? <V>() => MakeDictionary({ __proto__: null as any } as HashMap<V>)
                : <V>() => MakeDictionary({} as HashMap<V>),

        has: downLevel
            ? <V>(map: HashMap<V>, key: string | number | symbol) => hasOwnProperty.call(map, key)
            : <V>(map: HashMap<V>, key: string | number | symbol) => key in map,

        get: downLevel
            ? <V>(map: HashMap<V>, key: string | number | symbol): V | undefined => hasOwnProperty.call(map, key) ? map[key as string | number] : undefined
            : <V>(map: HashMap<V>, key: string | number | symbol): V | undefined => map[key as string | number],
    };
    // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
    function MakeDictionary<T>(obj: T): T {
        (<any>obj).__ = undefined;
        delete (<any>obj).__;
        return obj;
    }
}