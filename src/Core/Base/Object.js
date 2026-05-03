export function objectChangedKeys(a, b) {
  a = a || {};
  b = b || {};
  const aKeys = Object.keys(a),
    bKeys = Object.keys(b);
  return aKeys.filter(
    (key, idx) => bKeys[idx] !== aKeys[idx] || !Object.is(a[key], b[key]),
  );
}

export function getCircularReplacer(object) {
  if (typeof object !== 'object' || object === null) {
    return object;
  }
  const keysSet = new Set(Object.keys(object));
  const seen = new WeakSet();
  return (key, value) => {
    if (key && !keysSet.has(key)) {
      return;
    }
    if (typeof value === 'function') {
      return;
    }
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

export function createObject(props, id) {
  const monitor = new Map();
  let counter = 0;
  let node;
  const unique = crypto.randomUUID();
  const internalState = { ...props };

  const notify = (keys) => {
    if (!Array.isArray(keys)) {
      return;
    }
    counter++;
    for (const [cb, item] of monitor.entries()) {
      if ((!item.key || keys.includes(item.key)) && typeof cb === 'function') {
        item.counter++;
        cb([item.key, ...keys].filter(Boolean));
      }
    }
  };

  const target = () => {};

  const proxy = new Proxy(target, {
    get: (target, propertyKey, receiver) => {
      if (Object.hasOwn(internalState, propertyKey)) {
        return internalState[propertyKey];
      }
      return Reflect.get(target, propertyKey, receiver);
    },
    set: (target, propertyKey, value, receiver) => {
      if (typeof propertyKey === 'string' && propertyKey.startsWith('__')) {
        return Reflect.set(target, propertyKey, value, receiver);
      }

      if (internalState[propertyKey] === value) {
        return true;
      }

      internalState[propertyKey] = value;
      notify([propertyKey]);
      return true;
    },
    deleteProperty: (_, propertyKey) => {
      if (Object.hasOwn(internalState, propertyKey)) {
        delete internalState[propertyKey];
        notify([propertyKey]);
        return true;
      }
      return false;
    },
    apply(_, thisArg, argumentsList) {
      const cb = argumentsList[0];
      if (typeof cb === 'function') {
        const draft = { ...internalState };
        cb.call(thisArg, draft);

        const changedKeys = [];

        for (const key in draft) {
          if (internalState[key] !== draft[key]) {
            internalState[key] = draft[key];
            changedKeys.push(key);
          }
        }

        for (const key in internalState) {
          if (!(key in draft)) {
            delete internalState[key];
            changedKeys.push(key);
          }
        }

        if (changedKeys.length > 0) {
          notify(changedKeys);
        }
      }
    },
    ownKeys: (target) => {
      const stateKeys = Reflect.ownKeys(internalState);
      const targetKeys = Reflect.ownKeys(target);
      return Array.from(new Set([...stateKeys, ...targetKeys]));
    },
    has: (target, propertyKey) =>
      propertyKey in internalState || Reflect.has(target, propertyKey),
    getOwnPropertyDescriptor(target, propertyKey) {
      if (Object.hasOwn(internalState, propertyKey)) {
        return {
          value: internalState[propertyKey],
          writable: true,
          enumerable: true,
          configurable: true,
        };
      }
      return Reflect.getOwnPropertyDescriptor(target, propertyKey);
    },
  });

  Object.defineProperty(proxy, '__monitor', {
    value: (key, cb, id) => {
      monitor.set(cb, { key, cb, id, counter: 0 });
    },
    writable: false,
    enumerable: false,
  });

  Object.defineProperty(proxy, '__unmonitor', {
    value: (_, cb) => {
      monitor.delete(cb);
    },
    writable: false,
    enumerable: false,
  });

  Object.defineProperty(proxy, '__monitored', {
    get: () => Array.from(monitor.values()),
    enumerable: false,
  });

  Object.defineProperty(proxy, '__unique', {
    get: () => unique,
    enumerable: false,
  });

  Object.defineProperty(proxy, '__id', {
    get: () => id,
    enumerable: false,
  });

  Object.defineProperty(proxy, '__object', {
    get: () => internalState,
    enumerable: false,
  });

  Object.defineProperty(proxy, '__counter', {
    get: () => counter,
    enumerable: false,
  });

  Object.defineProperty(proxy, '__string', {
    get: () => {
      return JSON.stringify(
        internalState,
        getCircularReplacer(internalState),
        2,
      );
    },
    enumerable: false,
  });

  Object.defineProperty(proxy, '__node', {
    get: () => node,
    set: (value) => {
      node = value;
    },
    enumerable: false,
    configurable: true,
  });

  return proxy;
}

export function filterObjectByKeys(obj, keysToFilter) {
  const filtered = {};
  const leftover = {};
  const keysSet = new Set(keysToFilter);

  Object.entries(obj).forEach(([key, value]) => {
    const target = keysSet.has(key) ? filtered : leftover;
    target[key] = value;
  });

  return [filtered, leftover];
}
