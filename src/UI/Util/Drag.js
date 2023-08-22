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
        state[prop] = true;
        initialCb(e, state);
    }, [state, handle, initialCb, prop]);
    const handleMouseUp = useCallback((e) => {
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
    const initialCb = useCallback((e, state) => {
        if (!state.region) {
            return;
        }
        state.offset = {
            x: e.clientX - state.region.left - state?.target?.offsetLeft,
            y: e.clientY - state.region.top - state?.target?.offsetTop
        };
    }, []);
    const moverCb = useCallback((e, state) => {
        if (!state.region) {
            return;
        }
        state.region.left = e.clientX - state.offset.x - state?.target?.offsetLeft;
        state.region.top = e.clientY - state.offset.y - state?.target?.offsetTop;
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