import { useMemo } from "react";

export function useCanvasContext(element) {
    const ctx = useMemo(() => element?.current?.getContext("2d"), [element]);
    return ctx;
}

export function resizeCanvasToDisplaySize(canvas) {
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // If it's resolution does not match change it
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }

    return false;
}
