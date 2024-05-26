import { useCallback } from "react";
import { createState } from "src/Core/Base/State";
import { useEventListener } from "./EventListener";
import { getClientDocument } from "../Util/Client";
import { useElement } from "../Base/Element";

const Drag = createState("Drag");

export function useDrag(initialCb, moverCb, prop, enabled) {
    const ref = useElement();
    const drag = Drag.useState();
    const handle = ref.current;
    const handlePointerDown = useCallback((e) => {
        drag.dragged = null;
        drag.target = handle;
        drag[prop] = true;
        initialCb(e, drag);
        moverCb(e, drag);
        drag.onDragStart && drag.onDragStart(drag, handle);
    }, [drag, handle, initialCb, moverCb, prop]);
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
        drag.target = null;
        drag.offset = null;
        drag[prop] = false;
        drag.onDragEnd && drag.onDragEnd(drag, handle);
    }, [drag, prop]);

    const document = getClientDocument();
    useEventListener(!!enabled && handle, "pointerdown", handlePointerDown, { passive: true });
    useEventListener(!!enabled && document, "pointermove", handlePointerMove, { passive: true });
    useEventListener(!!enabled && document, "pointerup", handlePointerUp, { passive: true });

    return ref;
}

export default Drag;
