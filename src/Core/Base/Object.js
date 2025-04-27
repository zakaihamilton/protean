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
    const notify = (key) => {
        counter++;
        for (const item of monitor) {
            if ((!item.key || key === item.key) && item.cb) {
                item.counter++;
                item.cb(key);
            }
        }
    }
    const proxy = new Proxy(props, {
        set: function (target, propertyKey, value, receiver) {
            if (Reflect.get(target, propertyKey, receiver) === value) {
                return true;
            }
            const result = Reflect.set(target, propertyKey, value, receiver);
            notify(propertyKey);
            return result;
        },
        deleteProperty: function (target, propertyKey, receiver) {
            if (!Reflect.has(target, propertyKey)) {
                return true;
            }
            const result = Reflect.deleteProperty(target, propertyKey, receiver);
            notify(propertyKey);
            return result;
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
        }
    });
    Object.defineProperty(proxy, "__monitored", {
        get: () => monitor
    });
    Object.defineProperty(proxy, "__unique", {
        get: () => unique
    });
    Object.defineProperty(proxy, "__id", {
        get: () => id
    });
    Object.defineProperty(proxy, "__counter", {
        get: () => counter
    });
    Object.defineProperty(proxy, "__node", {
        get: () => node,
        set: (value) => {
            node = value
        }
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
