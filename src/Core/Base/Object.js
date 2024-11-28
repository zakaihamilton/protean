export function objectHasChanged(a, b) {
    a = a || {};
    b = b || {};
    const aKeys = Object.keys(a), bKeys = Object.keys(b);
    return aKeys.filter((key, idx) => bKeys[idx] !== aKeys[idx] || !Object.is(a[key], b[key]));
}

export function createObject(props, id) {
    const monitor = [];
    let counter = 0;
    let node = undefined;
    const unique = crypto.randomUUID();
    const forward = (method, ...args) => {
        const result = Reflect[method](...args);
        counter++;
        for (const item of monitor) {
            const [, key, value] = args;
            if ((!item.key || key === item.key) && item.cb) {
                item.counter++;
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
        value: (key, cb, id) => {
            monitor.push({ id, key, cb, counter: 0 });
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
    Object.defineProperty(proxy, "__counter", {
        get: () => counter,
        enumerable: false
    });
    Object.defineProperty(proxy, "__node", {
        get: () => node,
        set: (value) => {
            node = value
        },
        enumerable: false
    });
    return proxy;
}

export function filterObjectByKeys(obj, keysToFilter) {
    const filtered = {}, leftover = {};

    for (const key in obj) {
        const target = keysToFilter.includes(key) ? filtered : leftover;
        target[key] = obj[key];
    }

    return [filtered, leftover];
}
