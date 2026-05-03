import { createContext, useContext, useMemo } from 'react';

const root = {
  id: 'root',
  parent: null,
  items: new Map(),
  listeners: new Set(),
};
const Context = createContext(root);

export default function Node({ id, children }) {
  const parent = Node.useNode();

  const node = useMemo(
    () => ({
      id,
      parent,
      items: new Map(),
      listeners: new Set(),
    }),
    [id, parent],
  );

  return <Context value={node}>{children}</Context>;
}

Node.useNode = (propId) => {
  let node = useContext(Context);
  if (propId) {
    while (node && typeof nodeGetProperty(node, propId) === 'undefined') {
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
    queueMicrotask(() => {
      node.listeners?.forEach((callback) => {
        callback(node, id, value);
      });
    });
  }
}

export function subscribeToNode(node, callback) {
  if (node?.listeners) {
    node.listeners.add(callback);
    return () => node.listeners.delete(callback);
  }
  return () => {};
}

export function nodeGetId(node) {
  return node?.id;
}
