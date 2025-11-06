export function objectHasChanged(a, b) {
    a = a || {};
    b = b || {};
    const aKeys = Object.keys(a), bKeys = Object.keys(b);
    return aKeys.filter((key, idx) => bKeys[idx] !== aKeys[idx] || !Object.is(a[key], b[key]));
}

export function getCircularReplacer(object) {
    const keys = Object.keys(object);
    const seen = new WeakSet();
    return (key, value) => {
        if (key && !keys.includes(key)) {
            return;
        }
        if (typeof value === "function") {
            return;
        }
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
}

export function createObject(props, id) {
    const monitor = [];
    let counter = 0;
    let node = undefined;
    const unique = crypto.randomUUID();
    const internalState = { ...props };
    const notify = (key) => {
        counter++;
        for (const item of monitor) {
            if ((!item.key || key === item.key) && item.cb) {
                item.counter++;
                item.cb(key);
            }
        }
    };
    const target = () => { };
    const proxy = new Proxy(target, {
        get: function (target, propertyKey, receiver) {
            if (Object.prototype.hasOwnProperty.call(internalState, propertyKey)) {
                return internalState[propertyKey];
            }
            return Reflect.get(target, propertyKey, receiver);
        },
        set: function (target, propertyKey, value, receiver) {
            if (typeof propertyKey === 'string' && propertyKey.startsWith('__')) {
                return Reflect.set(target, propertyKey, value, receiver);
            }

            if (internalState[propertyKey] === value) {
                return true;
            }
            internalState[propertyKey] = value;
            notify(propertyKey);
            return true;
        },
        deleteProperty: function (target, propertyKey) {
            if (Object.prototype.hasOwnProperty.call(internalState, propertyKey)) {
                delete internalState[propertyKey];
                notify(propertyKey);
                return true;
            }
            return false;
        },
        apply(_, thisArg, argumentsList) {
            const cb = argumentsList[0];
            if (typeof cb === "function") {
                const draft = { ...internalState };
                cb.call(thisArg, draft);

                const oldKeys = new Set(Object.keys(internalState));
                const newKeys = new Set(Object.keys(draft));
                let hasChanged = false;

                for (const key of newKeys) {
                    if (!oldKeys.has(key) || internalState[key] !== draft[key]) {
                        internalState[key] = draft[key];
                        hasChanged = true;
                    }
                }

                for (const key of oldKeys) {
                    if (!newKeys.has(key)) {
                        delete internalState[key];
                        hasChanged = true;
                    }
                }

                if (hasChanged) {
                    notify(null);
                }
            }
        },
        ownKeys: function (target) {
            const stateKeys = Reflect.ownKeys(internalState);
            const targetKeys = Reflect.ownKeys(target);
            return Array.from(new Set([...stateKeys, ...targetKeys]));
        },
        has: function (target, propertyKey) {
            return propertyKey in internalState || Reflect.has(target, propertyKey);
        },
        getOwnPropertyDescriptor(target, propertyKey) {
            if (Object.prototype.hasOwnProperty.call(internalState, propertyKey)) {
                return {
                    value: internalState[propertyKey],
                    writable: true,
                    enumerable: true,
                    configurable: true,
                };
            }
            return Reflect.getOwnPropertyDescriptor(target, propertyKey);
        }
    });

    Object.defineProperty(proxy, "__monitor", {
        value: (key, cb, id) => {
            monitor.push({ key, cb, id, counter: 0 });
        },
        writable: false,
        enumerable: false
    });

    Object.defineProperty(proxy, "__unmonitor", {
        value: (key, cb, id) => {
            const index = monitor.findIndex(item => item.key === key && item.cb === cb && item.id === id);
            if (index !== -1) {
                monitor.splice(index, 1);
            }
        },
        writable: false,
        enumerable: false
    });

    Object.defineProperty(proxy, "__monitored", {
        get: () => monitor,
        enumerable: false
    });

    Object.defineProperty(proxy, "__unique", {
        get: () => unique,
        enumerable: false
    });

    Object.defineProperty(proxy, "__id", {
        get: () => id,
        enumerable: false
    });

    Object.defineProperty(proxy, "__object", {
        get: () => internalState,
        enumerable: false
    });

    Object.defineProperty(proxy, "__counter", {
        get: () => counter,
        enumerable: false
    });

    Object.defineProperty(proxy, "__string", {
        get: () => {
            return JSON.stringify(internalState, getCircularReplacer(internalState), 2);
        },
        enumerable: false
    });

    Object.defineProperty(proxy, "__node", {
        get: () => node,
        set: (value) => {
            node = value;
        },
        enumerable: false,
        configurable: true
    });

    return proxy;
}

export function filterObjectByKeys(obj, keysToFilter) {
    const filtered = {};
    const leftover = {};
    const keysSet = new Set(keysToFilter);

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const target = keysSet.has(key) ? filtered : leftover;
            target[key] = obj[key];
        }
    }

    return [filtered, leftover];
}