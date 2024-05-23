import React, { createContext, useContext, useRef } from "react";

const root = { id: "root", parent: null, items: [] };
const Context = createContext(root);

export default function Node({ id, children }) {
    const parent = Node.useNode();
    const nodeRef = useRef({ id, parent, items: [] });

    return <Context.Provider value={nodeRef?.current}>
        {children}
    </Context.Provider>;
}

Node.useNode = (nodeId, propId) => {
    let node = useContext(Context);
    if (typeof nodeId !== "undefined") {
        if (nodeId === null) {
            return node;
        }
        while (node && nodeGetId(node) !== nodeId) {
            node = node.parent;
        }
        return node;
    }
    if (propId) {
        while (node && typeof nodeGetProperty(node, propId) === "undefined") {
            node = node.parent;
        }
    }
    return node;
};

export function nodeGetParent(node) {
    return node?.parent;
}

export function nodeGetProperty(node, propId) {
    const item = node?.items?.find(i => i.id === propId);
    return item?.value;
}

export function nodeSetProperty(node, id, value) {
    const item = node?.items?.find(i => i.id === id);
    if (item) {
        item.value = value;
    }
    else if (node) {
        node.items.push({ id, name: id?.displayName, value });
    }
}

export function nodeGetId(node) {
    return node && node.id;
}

export function withNode(Component) {
    if (!Component) {
        throw new Error("Component is required");
    }
    const displayName = Component.displayName || Component.name || "";
    function WrappedNode({ children, ...props }) {
        return <Node id={displayName}>
            <Component {...props}>
                {children}
            </Component>
        </Node>;
    }
    Object.setPrototypeOf(WrappedNode, Component);
    return WrappedNode;
}
