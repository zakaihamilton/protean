import React, { createContext, useContext, useMemo } from "react";

const root = { id: "root", parent: null, items: new Map() };
const Context = createContext(root);

export default function Node({ id, children }) {
    const parent = Node.useNode();

    // Use useMemo to create a stable node object that
    // correctly updates if the id or parent changes.
    const node = useMemo(() => ({
        id,
        parent,
        items: new Map(), // Initialize items directly
    }), [id, parent]); // Dependencies

    // Pass the memoized 'node' object to the provider
    return <Context value={node}>
        {children}
    </Context>;
}

Node.useNode = (propId) => {
    let node = useContext(Context);
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