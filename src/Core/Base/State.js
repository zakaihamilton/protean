import { useState, useRef, useEffect, useCallback } from "react";
import Node, { nodeGetProperty, nodeSetProperty } from "./Node";
import { objectHasChanged, createObject } from "./Object";

export function createState(displayName) {
    function State({ id, nodeId, ...props }) {
        const object = State.useDynamicState([], nodeId, { ...props });
        const [updatedProps, setUpdatedProps] = useState({ ...props });
        const valueChanged = object && objectHasChanged(props, updatedProps);
        const changeRef = useRef(0);
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

        return null;
    }
    State.useDynamicState = (selector, nodeId, props) => {
        let node = Node.useNode(nodeId, State);
        const lastNode = Node.useNode(nodeId);
        if (!node) {
            node = lastNode;
        }
        let object = nodeGetProperty(node, State);
        if (!object && node) {
            object = createObject(props || {});
            nodeSetProperty(node, State, object);
        }
        useStateFromObject(object, selector);
        return object;
    };
    State.usePassiveState = (nodeId) => {
        const node = Node.useNode(nodeId, State);
        const object = nodeGetProperty(node, State);
        return object;
    };
    State.useState = (selector, nodeId) => {
        const object = State.usePassiveState(nodeId);
        useStateFromObject(object, selector);
        return object;
    };
    State.displayName = displayName + ".State";
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
    else if (typeof selector === "function" && !selector(key)) {
        return false;
    }
    return true;
}

export function useStateHandlerFromObject(object, handler) {
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
}

export function useStateFromObject(object, selector) {
    const [, setCounter] = useState(0);
    const handler = useCallback((_method, _target, key) => {
        if (!selector || isSelectorMatch(selector, key)) {
            setCounter(counter => counter + 1);
        }
    }, [selector]);
    useStateHandlerFromObject(object, handler);
    return object;
};

export function withState(Component, State) {
    const displayName = Component.displayName || Component.name || "";
    if (!Component) {
        throw new Error("Component is required");
    }
    if (!State) {
        Component.State = State = createState(displayName);
    }
    function Wrapped({ children, ...props }) {
        return <Node id={displayName}>
            <State {...props} />
            <Component>
                {children}
            </Component>
        </Node>;
    }
    Object.setPrototypeOf(Wrapped, Component);
    return Wrapped;
}
