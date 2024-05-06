import { useCallback } from "react";
import { useDrag } from "../Drag";
import { getOffsetRect } from "../Region";

export function useMoveDrag(enabled) {
    const initialCb = useCallback((e, state) => {
        const targetRect = getOffsetRect(state?.target);
        state.offset = {
            x: Math.floor(e.clientX - targetRect.left + (state.marginLeft || 0)),
            y: Math.floor(e.clientY - targetRect.top + (state.marginTop || 0))
        };
        state.base = {
            x: e.clientX,
            y: e.clientY,
            left: targetRect.left,
            top: targetRect.top,
            width: targetRect.width,
            height: targetRect.height
        };
    }, []);
    const moverCb = useCallback((e, state) => {
        const targetRect = getOffsetRect(state?.target);
        if (!state.rect) {
            state.rect = { ...targetRect };
        }
        const left = Math.floor(e.clientX - state.offset.x);
        const top = Math.floor(e.clientY - state.offset.y);
        if (state.base.left !== left || state.base.top !== top) {
            state.rect = Object.assign(state.rect, { left, top });
            state.dragged = { x: e.clientX - state.base.x, y: e.clientY - state.base.y };
        }
        else {
            state.dragged = null;
        }
        state.touch = { x: e.clientX, y: e.clientY };
    }, []);
    return useDrag(initialCb, moverCb, "moving", enabled);
}
