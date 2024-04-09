import { useCallback, useEffect, useState } from "react";
import { createState } from "src/Core/Base/State";

const Drag = createState("Drag");

const useDrag = (initialCb, moverCb, prop, enabled) => {
    const [handle, setHandle] = useState(null);
    const state = Drag.useState();
    const ref = useCallback((ref) => {
        setHandle(ref);
    }, []);
    const handlePointerDown = useCallback((e) => {
        state.target = handle;
        state[prop] = true;
        initialCb(e, state);
    }, [state, handle, initialCb, prop]);
    const handlePointerUp = useCallback((e) => {
        state.target = null;
        state.offset = null;
        state[prop] = false;
    }, [state, prop]);
    const handlePointerMove = useCallback((e) => {
        if (state.target && state[prop]) {
            moverCb(e, state);
        }
    }, [state, prop, moverCb]);

    useEffect(() => {
        if (!handle) {
            return;
        }
        if (!enabled) {
            return;
        }
        handle.addEventListener("pointerdown", handlePointerDown);
        window.document.addEventListener("pointerup", handlePointerUp);
        window.document.addEventListener("pointermove", handlePointerMove);
        return () => {
            handle.removeEventListener("pointerdown", handlePointerDown);
            window.document.removeEventListener("pointerup", handlePointerUp);
            window.document.removeEventListener("pointermove", handlePointerMove);
        };
    }, [enabled, handle, handlePointerDown, handlePointerMove, handlePointerUp]);

    return ref;
};

export function useMoveDrag(enabled) {
    const initialCb = useCallback((e, state) => {
        if (!state.rect) {
            return;
        }
        const targetRect = state?.target?.getBoundingClientRect();
        state.offset = {
            x: Math.floor(e.clientX - targetRect.left),
            y: Math.floor(e.clientY - targetRect.top)
        };
    }, []);
    const moverCb = useCallback((e, state) => {
        if (!state.rect) {
            return;
        }
        const parentRect = state?.target?.parentElement?.getBoundingClientRect();
        const targetRect = state?.target?.getBoundingClientRect();
        state.rect.left = Math.floor(e.clientX - state.offset.x - (targetRect.left - parentRect.left));
        state.rect.top = Math.floor(e.clientY - state.offset.y - (targetRect.top - parentRect.top));
        state.touch = { x: e.clientX, y: e.clientY };
    }, []);
    return useDrag(initialCb, moverCb, "moving", enabled);
}

export function useResizeDrag(enabled) {
    const initialCb = useCallback((e, state) => {
        if (!state.rect) {
            return;
        }
        state.offset = {
            x: Math.floor(e.clientX - state.rect.width),
            y: Math.floor(e.clientY - state.rect.height)
        };
    }, []);
    const moverCb = useCallback((e, state) => {
        if (!state.rect) {
            return;
        }
        state.rect.width = Math.floor(Math.max(e.clientX - state.offset.x, state.min?.width || 0));
        state.rect.height = Math.floor(Math.max(e.clientY - state.offset.y, state.min?.height || 0));
    }, []);
    return useDrag(initialCb, moverCb, "resizing", enabled);
}

export default Drag;