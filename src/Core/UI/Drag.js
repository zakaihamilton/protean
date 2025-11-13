import { useCallback } from "react";
import { createState } from "src/Core/Base/State";
import { useEventListener } from "./EventListener";
import { getClientDocument } from "../Util/Client";
import { useElement } from "./Element";

const Drag = createState("Drag");

export function useDrag(initialCb, moverCb, prop, enabled) {
    const [target, element] = useElement();
    const drag = Drag.useState();
    const handlePointerDown = useCallback((e) => {
        drag(state => {
            state.dragged = null;
            state.target = target;
            state[prop] = true;
            initialCb(e, state);
        });
        drag.onDragStart && drag.onDragStart(drag, target);
    }, [drag, target, initialCb, prop]);
    const handlePointerMove = useCallback((e) => {
        if (drag.target && drag[prop]) {
            moverCb(e, drag);
            const handle = drag.target;
            drag.onDragMove && drag.onDragMove(drag, handle);
        }
    }, [drag, prop, moverCb]);
    const handlePointerUp = useCallback(() => {
        if (!drag.target || !drag[prop]) {
            return;
        }
        const handle = drag.target;
        drag(state => {
            state.target = null;
            state.offset = null;
            state[prop] = false;
        });
        drag.onDragEnd && drag.onDragEnd(drag, handle);
    }, [drag, prop]);

    const document = getClientDocument();
    useEventListener(!!enabled && target, "pointerdown", handlePointerDown, { passive: true });
    useEventListener(!!enabled && document, "pointermove", handlePointerMove, { passive: true });
    useEventListener(!!enabled && document, "pointerup", handlePointerUp, { passive: true });

    return [target, element];
}

export default Drag;
