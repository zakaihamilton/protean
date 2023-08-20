import { useCallback, useEffect, useState } from "react";
import { createState } from "src/Core/Base/State";

const Drag = createState("Drag");

const useDrag = (initialCb, moverCb, prop) => {
    const [handle, setHandle] = useState(null);
    const state = Drag.useState();
    const ref = useCallback((ref) => {
        setHandle(ref);
    }, []);
    const handleMouseDown = useCallback((e) => {
        state.target = handle;
        state.offset = initialCb(e, state);
        state[prop] = true;
    }, [state, handle, initialCb, prop]);
    const handleMouseUp = useCallback(() => {
        state.target = null;
        state.offset = null;
        state[prop] = false;
    }, [state, prop]);
    const handleMouseMove = useCallback((e) => {
        if (state.target && state[prop]) {
            moverCb(e, state);
        }
    }, [state, prop, moverCb]);

    useEffect(() => {
        if (!handle) {
            return;
        }
        handle.addEventListener("mousedown", handleMouseDown);
        window.document.addEventListener("mouseup", handleMouseUp);
        window.document.addEventListener("mousemove", handleMouseMove);
        return () => {
            handle.removeEventListener("mousedown", handleMouseDown);
            window.document.removeEventListener("mouseup", handleMouseUp);
            window.document.removeEventListener("mousemove", handleMouseMove);
        };
    }, [handle, handleMouseDown, handleMouseMove, handleMouseUp]);

    return ref;
};

export function useMoveDrag() {
    const initialCb = useCallback((e, state) => ({
        x: e.clientX - state.region.left,
        y: e.clientY - state.region.top,
    }), []);
    const moverCb = useCallback((e, state) => {
        state.region.left = e.clientX - state.offset.x;
        state.region.top = e.clientY - state.offset.y;
    }, []);
    return useDrag(initialCb, moverCb, "moving");
}

export function useResizeDrag() {
    const initialCb = useCallback((e, state) => ({
        x: e.clientX - state.region.width,
        y: e.clientY - state.region.height,
    }), []);
    const moverCb = useCallback((e, state) => {
        state.region.width = Math.max(e.clientX - state.offset.x, state.min?.width || 0);
        state.region.height = Math.max(e.clientY - state.offset.y, state.min?.height || 0);
    }, []);
    return useDrag(initialCb, moverCb, "resizing");
}

export default Drag;