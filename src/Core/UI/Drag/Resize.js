import { useCallback } from "react";
import { useDrag } from "../Drag";
import { getOffsetRect } from "../Region";

export function useResizeDrag(enabled, direction = "ltr") {
    const initialCb = useCallback((e, state) => {
        const clientRect = state?.target?.getBoundingClientRect();
        const targetRect = getOffsetRect(state?.target);
        if (!state.rect) {
            state.rect = { ...targetRect };
        }
        state.shiftLeft = 0 - Math.floor(e.clientX - clientRect.left);

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
        let width, left;
        const height = Math.floor(Math.max(e.clientY - state.offset.y, state.min?.height || 0));
        if (direction === "ltr") {
            left = state.rect.left;
            width = Math.floor(Math.max(e.clientX - state.offset.x, state.min?.width || 0));
        }
        else {
            width = Math.floor(Math.max(state.base.x - e.clientX + state.base.width, state.min?.width || 0));
            left = Math.floor(state.base.x - width + state.base.width + state.shiftLeft);
        }
        if (state.base.width !== width || state.base.height !== height) {
            state.rect = Object.assign(state.rect, { left, width, height });
            state.dragged = { x: e.clientX - state.base.x, y: e.clientY - state.base.y };
        }
        else {
            state.dragged = null;
        }
    }, [direction]);
    return useDrag(initialCb, moverCb, "resizing", enabled);
}
