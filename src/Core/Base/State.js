import { useState, useRef, useEffect, useCallback } from "react";
import Node from "./Node";
import { objectHasChanged, createObject } from "./Object";

export function createState(displayName, nodeId) {
    function State({ children, ...props }) {
        const node = Node.useNode(nodeId);
        let object = node.get(State);
        const [updatedProps, setUpdatedProps] = useState({ ...props });
        const valueChanged = object && objectHasChanged(props, updatedProps);
        const changeRef = useRef(0);
        if (!object) {
            object = createObject(props);
            node.set(State, object);
        }
        if (valueChanged) {
            changeRef.current++;
        }
        useEffect(() => {
            if (!changeRef.current) {
                return;
            }
            setUpdatedProps({ ...props });
            Object.assign(object, props);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [changeRef.current]);
        return children;
    }
    State.useState = (selector) => {
        const node = Node.useNode(nodeId, State);
        const object = node && node.get(State);
        useStateFromObject(object, selector);
        return object;
    };
    State.usePassiveState = () => State.useState([]);
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
        else {
            if (!selector[key]) {
                return false;
            }
        }
    }
    else if (typeof selector === "function") {
        if (!selector(key)) {
            return false;
        }
    }
    return true;
}

export function useStateFromObject(object, selector) {
    const [, setCounter] = useState(0);
    const handler = useCallback((_, key) => {
        if (!selector || isSelectorMatch(selector, key)) {
            setCounter(counter => counter + 1);
        }
    }, [selector]);
    useEffect(() => {
        if (!object) {
            return;
        }
        object.__register(handler);
        return () => {
            object.__unregister(handler);
        };
    }, [object, handler]);
    return object;
};
