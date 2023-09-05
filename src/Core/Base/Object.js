import { useEffect } from "react";

export function objectHasChanged(a, b) {
    a = a || {};
    b = b || {};
    const aKeys = Object.keys(a), bKeys = Object.keys(b);
    let changed = aKeys.some((_, idx) => bKeys[idx] !== aKeys[idx]);
    return changed || aKeys.some(key => !Object.is(a[key], b[key]));
}

export function createObject(props) {
    const monitor = [];
    let counter = 0;
    const forward = (method, ...args) => {
        const result = Reflect[method](...args);
        counter++;
        for (const item of monitor) {
            const [_target, key, value] = args;
            if ((!item.key || key === item.key) && item.cb) {
                item.cb(value, key);
            }
        }
        return result;
    }
    const proxy = new Proxy({ ...props }, {
        set: function (target, key, value) {
            if (target[key] === value) {
                return true;
            }
            return forward("set", target, key, value);
        },
        deleteProperty: function (target, key) {
            if (!(key in target)) {
                return true;
            }
            return forward("deleteProperty", target, key);
        },
        defineProperty: function (target, key, descriptor) {
            return forward("defineProperty", target, key, descriptor);
        }
    });
    Object.defineProperty(proxy, "__monitor", {
        value: (key, cb) => {
            monitor.push({ key, cb })
        },
        writable: false,
        enumerable: false
    });
    Object.defineProperty(proxy, "__unmonitor", {
        value: (key, cb) => {
            const index = monitor.findIndex(item => item.key === key && item.cb === cb);
            if (index !== -1) {
                monitor.splice(index, 1);
            }
        },
        writable: false,
        enumerable: false
    });
    Object.defineProperty(proxy, "__counter", {
        get: () => counter,
        enumerable: false
    });
    return proxy;
}

export function useMonitor(objects, key, handler) {
    useEffect(() => {
        if (!objects || !handler) {
            return;
        }
        for (const object of objects) {
            if (!object) {
                continue;
            }
            object.__monitor(key, handler);
        }
        return () => {
            for (const object of objects) {
                if (!object) {
                    continue;
                }
                object.__unmonitor(key, handler);
            }
        };
    }, [objects, key, handler]);
}

export function filterObjectByKeys(obj, keysToFilter) {
    const filtered = {}, leftover = {};

    for (const key in obj) {
        const target = keysToFilter.includes(key) ? filtered : leftover;
        target[key] = obj[key];
    }

    return [filtered, leftover];
}
