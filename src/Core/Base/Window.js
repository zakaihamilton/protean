export function useWindow() {
    const isClient = typeof window !== "undefined";
    if (isClient) {
        return window;
    }
    return undefined;
}

export function useWindowRegion() {
    const isClient = typeof window !== "undefined";
    if (isClient) {
        return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    }
    return undefined;
}