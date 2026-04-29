import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import Node, {
  nodeGetProperty,
  nodeSetProperty,
  subscribeToNode,
} from './Node';
import { createObject, objectChangedKeys } from './Object';

export function createState(displayName) {
  function State({ children, ...props }) {
    const object = State.useState(null, props);
    const prevPropsRef = useRef({});

    useEffect(() => {
      if (!object) return;
      const keysChanged = objectChangedKeys(props, prevPropsRef.current);
      if (keysChanged && keysChanged.length > 0) {
        prevPropsRef.current = props;
        object((draft) => {
          for (const key of keysChanged) {
            draft[key] = props[key];
          }
        });
      }
      // biome-ignore lint/correctness/useExhaustiveDependencies: Handled by objectChangedKeys
    }, [object, props]);

    if (!children) {
      return null;
    }

    if (typeof children === 'function') {
      return children(object);
    }

    return <Node id={displayName}>{children}</Node>;
  }

  State.useState = (selector, initial, id) => {
    let node = Node.useNode(initial ? null : State);
    const current = Node.useNode();
    if (!node) {
      node = current;
    }
    let object = nodeGetProperty(node, State);
    if (!object && node) {
      object = createObject({ ...(initial || {}) }, displayName);
      nodeSetProperty(node, State, object);
      object.__node = node;
    }

    if (object && initial && Object.keys(object).length === 0) {
      queueMicrotask(() => {
        if (Object.keys(object).length === 0) {
          Object.assign(object, initial);
        }
      });
    }

    useObjectState(object, selector, id);
    return object;
  };

  State.useFutureState = (selector, id) => {
    const startNode = Node.useNode();
    const foundObject = useRef(null);

    const [object, setObject] = useState(() => {
      let search = startNode;
      while (search) {
        const found = nodeGetProperty(search, State);
        if (found) {
          foundObject.current = found;
          return found;
        }
        search = search.parent;
      }
      return null;
    });

    useEffect(() => {
      if (object || foundObject.current) return;

      const unsubscribe = subscribeToNode((changedNode, propId, newValue) => {
        if (propId !== State) return;

        let search = startNode;
        while (search) {
          if (search === changedNode) {
            foundObject.current = newValue;
            setObject(newValue);
            return;
          }
          search = search.parent;
        }
      });

      return unsubscribe;
    }, [startNode, object]);

    const activeObject = object || foundObject.current;
    return useObjectState(activeObject, selector, id);
  };

  State.usePassiveState = () => {
    const node = Node.useNode(State);
    const object = nodeGetProperty(node, State);
    return object;
  };

  State.displayName = displayName;
  return State;
}

export function isSelectorMatch(selector, key) {
  if (selector === undefined) {
    return true;
  }
  if (!selector) {
    return false;
  }

  const selectorType = typeof selector;
  if (selectorType === 'string') {
    return selector === key;
  }
  if (selectorType === 'function') {
    return !!selector(key);
  }
  if (selectorType === 'object') {
    return Array.isArray(selector) ? selector.includes(key) : selector[key];
  }

  return true;
}

export function useObjectHandler(object, handler, id) {
  useEffect(() => {
    if (!object || !handler || !object.__monitor || !object.__unmonitor) {
      return;
    }
    object.__monitor(null, handler, id);
    handler(null);
    return () => {
      object.__unmonitor(null, handler, id);
    };
  }, [object, handler, id]);
  return object;
}

export function useObjectState(object, selector, id) {
  const subscribe = useCallback(
    (onStoreChange) => {
      if (!object) return () => {};

      if (typeof object.__monitor !== 'function') {
        return () => {};
      }

      const handler = (keys) => {
        if (!selector || keys.some((key) => isSelectorMatch(selector, key))) {
          onStoreChange();
        }
      };

      object.__monitor(null, handler, id);

      return () => {
        if (typeof object.__unmonitor === 'function') {
          object.__unmonitor(null, handler, id);
        }
      };
    },
    [object, selector, id],
  );

  const getSnapshot = useCallback(() => {
    if (!object) return null;

    if (typeof object.__counter === 'undefined') {
      return typeof selector === 'string' ? object[selector] : object;
    }

    if (typeof selector === 'string') {
      return object[selector];
    }

    return object.__counter;
  }, [object, selector]);

  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return object;
}
