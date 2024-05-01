export function getClientWindow() {
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof global !== "undefined") {
        return global;
    }
    return null;
}

export function getClientDocument() {
    if (typeof document !== "undefined") {
        return document;
    }
    if (typeof global !== "undefined") {
        return global.document;
    }
    return null;
}
