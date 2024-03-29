import { useCallback, useEffect, useState } from "react";
import { createState } from "src/Core/Base/State";

const Drag = createState("Drag");

const useDrag = (initialCb, moverCb, prop) => {
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
        handle.addEventListener("pointerdown", handlePointerDown);
        window.document.addEventListener("pointerup", handlePointerUp);
        window.document.addEventListener("pointermove", handlePointerMove);
        return () => {
            handle.removeEventListener("pointerdown", handlePointerDown);
            window.document.removeEventListener("pointerup", handlePointerUp);
            window.document.removeEventListener("pointermove", handlePointerMove);
        };
    }, [handle, handlePointerDown, handlePointerMove, handlePointerUp]);

    return ref;
};

export function useMoveDrag() {
    const initialCb = useCallback((e, state) => {
        if (!state.region) {
            return;
        }
        const targetRegion = state?.target?.getBoundingClientRect();
        state.offset = {
            x: e.clientX - targetRegion.left,
            y: e.clientY - targetRegion.top
        };
    }, []);
    const moverCb = useCallback((e, state) => {
        if (!state.region) {
            return;
        }
        const parentRegion = state?.target?.parentElement?.getBoundingClientRect();
        const targetRegion = state?.target?.getBoundingClientRect();
        state.region.left = e.clientX - state.offset.x - (targetRegion.left - parentRegion.left);
        state.region.top = e.clientY - state.offset.y - (targetRegion.top - parentRegion.top);
        state.touch = { x: e.clientX, y: e.clientY };
    }, []);
    return useDrag(initialCb, moverCb, "moving");
}

export function useResizeDrag() {
    const initialCb = useCallback((e, state) => {
        if (!state.region) {
            return;
        }
        state.offset = {
            x: e.clientX - state.region.width,
            y: e.clientY - state.region.height
        };
    }, []);
    const moverCb = useCallback((e, state) => {
        if (!state.region) {
            return;
        }
        state.region.width = Math.max(e.clientX - state.offset.x, state.min?.width || 0);
        state.region.height = Math.max(e.clientY - state.offset.y, state.min?.height || 0);
    }, []);
    return useDrag(initialCb, moverCb, "resizing");
}

export default Drag;