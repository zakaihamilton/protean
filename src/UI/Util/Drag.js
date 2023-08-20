import { useCallback, useEffect, useState } from "react";
import { createState, withState } from "src/Core/Base/State";

const Drag = createState("Drag");

export function useDrag() {
    const [handle, setHandle] = useState(null);
    const state = Drag.useState();
    const ref = useCallback(ref => {
        setHandle(ref);
    }, []);
    const handleMouseDown = useCallback((e) => {
        state.target = handle;
        state.offset = { x: e.clientX - state.region.left, y: e.clientY - state.region.top };
        state.dragging = true;
    }, [handle, state]);
    const handleMouseUp = useCallback((e) => {
        state.target = null;
        state.offset = null;
        state.dragging = false;
    }, [state]);
    const handleMouseMove = useCallback((e) => {
        if (state.target && state.dragging) {
            state.region.left = e.clientX - state.offset.x;
            state.region.top = e.clientY - state.offset.y;
        }
    }, [state]);
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
        }
    }, [handleMouseDown, handleMouseMove, handleMouseUp, handle]);
    return ref;
}

export default Drag;
