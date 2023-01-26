import { useMemo } from "react";

export function useCanvasContext(element) {
    const ctx = useMemo(() => element?.current?.getContext("2d"), [element]);
    return ctx;
}
