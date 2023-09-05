import { useState, useRef, useEffect, useCallback } from "react";
import Node, { nodeGetProperty, nodeSetProperty } from "./Node";
import { objectHasChanged, createObject, filterObjectByKeys } from "./Object";

export function createState(displayName) {
    function State({ id, nodeId, ...props }) {
        const object = State.useDynamicState(null, nodeId, { ...props });
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
    else if (typeof selector === "string") {
        return selector === key;
    }
    else if (typeof selector === "function" && !selector(key)) {
        return false;
    }
    return true;
}

export function useStateHandlerFromObject(object, handler) {
    useEffect(() => {
        if (!object || !handler) {
            return;
        }
        object.__monitor(null, handler);
        return () => {
            object.__unmonitor(null, handler);
        };
    }, [object, handler]);
    return object;
}

export function useStateFromObject(object, selector) {
    const [, setCounter] = useState(0);
    const handler = useCallback((_value, key) => {
        if (!selector || isSelectorMatch(selector, key)) {
            setCounter(counter => counter + 1);
            setCounter(counter => counter + 1);
        }
    }, [selector]);
    useStateHandlerFromObject(object, selector !== null && handler);
    return object;
};

export function withState(Component) {
    if (!Component) {
        throw new Error("Component is required");
    }
    const displayName = Component.displayName || Component.name || "";
    const State = Component.State = createState(displayName + ".State");
    function WrappedState({ children, ...props }) {
        return <Node id={displayName}>
            <State {...props} />
            <Component>
                {children}
            </Component>
        </Node>;
    }
    Object.setPrototypeOf(WrappedState, Component);
    return WrappedState;
}

export function withExtension(Component, Extension, propKeys=[]) {
    if (!Component) {
        throw new Error("Component is required");
    }
    if (!Extension) {
        throw new Error("Extension is required");
    }
    const displayName = Component.displayName || Component.name || "";
    const State = Component.State = createState(displayName + ".State");
    function WrappedExtension({ children, ...props }) {
        const [extensionProps, componentProps] = filterObjectByKeys(props, propKeys);
        return <Node id={displayName}>
            <State {...extensionProps} />
            <Extension>
                <Component {...componentProps}>
                    {children}
                </Component>
            </Extension>
        </Node>;
    }
    Object.setPrototypeOf(WrappedExtension, Component);
    return WrappedExtension;
}
