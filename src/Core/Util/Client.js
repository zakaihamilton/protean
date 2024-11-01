/**
 * Returns the current window object if it exists, otherwise returns null.
 * @returns {Window|null}
 */
export function getClientWindow() {
    if (typeof window !== "undefined") {
        return window;
    }
    return null;
}

/**
 * Returns the current document object if it exists, otherwise returns null.
 * @returns {Document|null}
 */
export function getClientDocument() {
    if (typeof document !== "undefined") {
        return document;
    }
    return null;
}
