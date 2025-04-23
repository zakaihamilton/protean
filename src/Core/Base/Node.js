import React, { createContext, useContext, useRef } from "react";

const root = { id: "root", parent: null, items: new Map() };
const Context = createContext(root);

export default function Node({ id, children }) {
    const parent = Node.useNode();
    const nodeRef = useRef({ id, parent, items: null });
    if (!nodeRef.current.items) {
        nodeRef.current.items = new Map();
    }

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
    return node?.items?.get(propId);
}

export function nodeSetProperty(node, id, value) {
    if (node?.items) {
        node.items.set(id, value);
    }
}

export function nodeGetId(node) {
    return node && node.id;
}
