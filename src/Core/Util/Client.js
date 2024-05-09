export function getClientWindow() {
    if (typeof window !== "undefined") {
        return window;
    }
    return null;
}

export function getClientDocument() {
    if (typeof document !== "undefined") {
        return document;
    }
    return null;
}
