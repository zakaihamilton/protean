import { useCallback } from "react";
import { createState } from "src/Core/Base/State";
import { useEventListener } from "./EventListener";
import { getClientDocument } from "../Util/Client";
import { useElement } from "../Base/Element";

const Drag = createState("Drag");

export function useDrag(initialCb, moverCb, prop, enabled) {
    const ref = useElement();
    const state = Drag.useState();
    const handle = ref.current;
    const handlePointerDown = useCallback((e) => {
        state.dragged = null;
        state.target = handle;
        state[prop] = true;
        initialCb(e, state);
        moverCb(e, state);
        state.onDragStart && state.onDragStart(state, handle);
    }, [state, handle, initialCb, moverCb, prop]);
    const handlePointerMove = useCallback((e) => {
        if (state.target && state[prop]) {
            moverCb(e, state);
            const handle = state.target;
            state.onDragMove && state.onDragMove(state, handle);
        }
    }, [state, prop, moverCb]);
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

    const document = getClientDocument();
    useEventListener(!!enabled && handle, "pointerdown", handlePointerDown, { passive: true });
    useEventListener(!!enabled && document, "pointermove", handlePointerMove, { passive: true });
    useEventListener(!!enabled && document, "pointerup", handlePointerUp, { passive: true });

    return ref;
}

export default Drag;
