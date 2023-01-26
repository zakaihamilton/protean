export function useWindow() {
    const isClient = typeof window !== "undefined";
    if (isClient) {
        return window;
    }
    return undefined;
}
