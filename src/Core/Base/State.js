import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import Node, { nodeGetProperty, nodeSetProperty } from "./Node";
import { objectHasChanged, createObject } from "./Object";

export function createState(displayName) {
    function State({ ...props }) {
        const object = State.useState([], props);
        const [updatedProps, setUpdatedProps] = useState({});
        const keysChanged = object && objectHasChanged(props, updatedProps);
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

        return null;
    }
    State.useState = (selector, initial, id) => {
        let node = Node.useNode(initial ? null : undefined, State);
        const lastNode = Node.useNode(initial ? null : undefined);
        if (!node) {
            node = lastNode;
        }
        let object = nodeGetProperty(node, State);
        if (!object && node) {
            object = createObject({ ...initial || {} }, displayName);
            nodeSetProperty(node, State, object);
            object.__node = node;
        }
        useObjectState(object, selector, id);
        return object;
    };
    State.usePassiveState = (nodeId) => {
        const node = Node.useNode(nodeId, State);
        const object = nodeGetProperty(node, State);
        return object;
    };
    State.displayName = displayName;
    return State;
}

export function isSelectorMatch(selector, key) {
    if (typeof selector === "object") {
        if (Array.isArray(selector)) {
            if (!selector.includes(key)) {
                return false;
            }
        }
        else if (!selector[key]) {
            return false;
        }
    }
    else if (typeof selector === "string") {
        return selector === key;
    }
    else if (typeof selector === "function" && !selector(key)) {
        return false;
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
    const [, setCounter] = useState(0);
    const selectorRef = useRef(selector);
    const handler = useCallback(key => {
        const selector = selectorRef.current;
        if (!selector || isSelectorMatch(selector, key)) {
            setCounter(counter => counter + 1);
        }
    }, []);
    useEffect(() => {
        selectorRef.current = selector;
    }, [selector]);
    useObjectHandler(object, handler, id);
    return object;
}
