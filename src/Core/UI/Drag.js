import { useCallback, useEffect, useState } from "react";
import { createState } from "src/Core/Base/State";
import { useEventListener } from "./EventListener";
import { getOffsetRect } from "./Region";
import { getClientDocument } from "../Util/Client";

const Drag = createState("Drag");

const useDrag = (initialCb, moverCb, prop, enabled) => {
    const [handle, setHandle] = useState(null);
    const state = Drag.useState();
    const ref = useCallback((ref) => {
        setHandle(ref);
    }, []);
    const handlePointerDown = useCallback((e) => {
        state.dragged = null;
        state.target = handle;
        state[prop] = true;
        initialCb(e, state);
        moverCb(e, state);
        state.onDragStart && state.onDragStart(state, handle);
    }, [state, handle, initialCb, moverCb, prop]);
    const handlePointerUp = useCallback(() => {
    if (!state.target || !state[prop]) {
            return;
        }
        const handle = state.target;
        state.target = null;
        state.offset = null;
        state[prop] = false;
        state.onDragEnd && state.onDragEnd(state, handle);
    }, [state, prop]);
    const handlePointerMove = useCallback((e) => {
        if (state.target && state[prop]) {
            moverCb(e, state);
            const handle = state.target;
            state.onDragMove && state.onDragMove(state, handle);
        }
    }, [state, prop, moverCb]);

    const document = getClientDocument();
    useEventListener(!!enabled && handle, "pointerdown", handlePointerDown, { passive: true });
    useEventListener(!!enabled && document, "pointermove", handlePointerMove, { passive: true });
    useEventListener(!!enabled && document, "pointerup", handlePointerUp, { passive: true });

    return ref;
};

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

export default Drag;