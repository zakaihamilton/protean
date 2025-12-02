import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import Node, { nodeGetProperty, nodeSetProperty } from "./Node";
import { objectChangedKeys, createObject } from "./Object";
import { useBatchedRender } from "./Render";

const stateRegistry = (typeof window !== 'undefined' && window.__STATE_REGISTRY__) || {};
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    window.__STATE_REGISTRY__ = stateRegistry;
}

export function createState(displayName) {
    function State({ children, ...props }) {
        const object = State.useState(null, props);
        const [updatedProps, setUpdatedProps] = useState({});
        const keysChanged = object && objectChangedKeys(props, updatedProps);
        const changeRef = useRef(0);
        if (keysChanged.length) {
            changeRef.current++;
        }
        useLayoutEffect(() => {
            if (!changeRef.current) {
                return;
            }
            setUpdatedProps(previous => {
                const result = { ...previous };
                for (const key of keysChanged) {
                    result[key] = props[key];
                }
                return result;
            });
            for (const key of keysChanged) {
                object[key] = props[key];
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [changeRef.current]);

        if (!children) {
            return null;
        }

        if (typeof children === 'function') {
            return children(object);
        }

        return <Node>{children}</Node>;
    }
    State.useState = (selector, initial, id) => {
        const [isMounted, setIsMounted] = useState(false);
        useEffect(() => {
            setIsMounted(true);
        }, []);

        let node = Node.useNode(initial ? null : State);
        const current = Node.useNode();
        if (!node) {
            node = current;
        }
        let object = nodeGetProperty(node, State);
        if (!object && node) {
            if (process.env.NODE_ENV === 'development' && isMounted && stateRegistry[displayName]) {
                object = stateRegistry[displayName];
            } else {
                object = createObject({ ...initial || {} }, displayName);
                if (process.env.NODE_ENV === 'development' && isMounted) {
                    stateRegistry[displayName] = object;
                }
            }
            nodeSetProperty(node, State, object);
            object.__node = node;
        }
        useObjectState(object, selector, id);
        return object;
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
    const render = useBatchedRender();
    const selectorRef = useRef(selector);
    const handler = useCallback(key => {
        const selector = selectorRef.current;
        if (!selector || isSelectorMatch(selector, key)) {
            render();
        }
    }, [render]);
    useEffect(() => {
        selectorRef.current = selector;
    }, [selector]);
    useObjectHandler(object, handler, id);
    return object;
}
