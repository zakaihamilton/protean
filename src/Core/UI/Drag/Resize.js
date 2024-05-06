import { useCallback } from "react";
import { useDrag } from "../Drag";
import { getOffsetRect } from "../Region";

export function useResizeDrag(enabled) {
    const initialCb = useCallback((e, state) => {
        const targetRect = getOffsetRect(state?.target);
        if (!state.rect) {
            state.rect = { ...targetRect };
        }
        state.offset = {
            x: Math.floor(e.clientX - state.rect.width),
            y: Math.floor(e.clientY - state.rect.height)
        };
        state.base = {
            x: e.clientX,
            y: e.clientY,
            width: state.rect.width,
            height: state.rect.height
        };
    }, []);
    const moverCb = useCallback((e, state) => {
        const width = Math.floor(Math.max(e.clientX - state.offset.x, state.min?.width || 0));
        const height = Math.floor(Math.max(e.clientY - state.offset.y, state.min?.height || 0));
        if (state.base.width !== width || state.base.height !== height) {
            state.rect = Object.assign(state.rect, { width, height });
            state.dragged = { x: e.clientX - state.base.x, y: e.clientY - state.base.y };
        }
        else {
            state.dragged = null;
        }
    }, []);
    return useDrag(initialCb, moverCb, "resizing", enabled);
}
