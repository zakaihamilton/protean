import React, { createContext, useContext, useMemo, useEffect } from "react";

const root = new Map([["id", "root"]]);
const Context = createContext(root);

export default function Node({ id, children }) {
    const parentNode = Node.useNode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const node = useMemo(() => new Map(!!id && [["id", id]]), []);

    useMemo(() => {
        node.parent = parentNode;
        node.children = [];
        if (!parentNode.children) {
            parentNode.children = [];
        }
        parentNode.children.push(node);
    }, [node, parentNode]);

    useEffect(() => {
        return () => {
            node.parent.children = node.parent.children.filter(el => el !== node);
        };
    }, [node]);

    useMemo(() => {
        if (id) {
            node.set("id", id);
        }
        else {
            node.delete("id");
        }
    }, [node, id]);

    return <Context.Provider value={node}>
        {children}
    </Context.Provider>;
}

Node.useNode = (nodeId, propId) => {
    let node = useContext(Context);
    if (nodeId) {
        while (node && node.get("id") !== nodeId) {
            node = node.parent;
        }
    }
    if (propId) {
        while (node && typeof node.get(propId) === "undefined") {
            node = node.parent;
        }
    }
    return node;
};
