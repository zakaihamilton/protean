import Drag from "src/Core/UI/Drag";
import Container from "src/UI/Util/Container";
import Windows from "src/UI/Windows";
import { useCallback } from "react";
import { getHitTargets } from "src/Core/UI/Region";
import { moveItem } from "src/Core/Base/Array";

export const DRAG_RANGE = 12;

export function ItemDrag({ item, index, vertical }) {
    const windows = Windows.State.useState(null);
    const container = Container.State.useState();
    const onDragStart = useCallback((state) => {
        state.clickable = true;
    }, []);
    const onDragMove = useCallback((state, handle) => {
        if (vertical ? Math.abs(state.dragged?.y) > DRAG_RANGE : Math.abs(state.dragged?.x) > DRAG_RANGE) {
            const hitTargets = getHitTargets(container.element, handle);
            const hitTarget = hitTargets?.[hitTargets?.length - 1];
            container.target = hitTarget;
            state.clickable = false;
        }
    }, [container, vertical]);
    const onDragEnd = useCallback((state, handle) => {
        container.target = null;
        if (vertical ? Math.abs(state.dragged?.y) > DRAG_RANGE : Math.abs(state.dragged?.x) > DRAG_RANGE) {
            const hitTargets = getHitTargets(container.element, handle);
            const hitTarget = hitTargets?.[hitTargets?.length - 1];
            if (hitTarget) {
                const targetIndex = parseInt(hitTarget.dataset.index);
                windows.list = moveItem(windows.list, index, targetIndex, item);
            }
            return;
        }
        if (!state.clickable) {
            return;
        }
        if (item?.focus) {
            item.minimize = true;
        }
        else {
            item.minimize = false;
            item.focus = true;
        }
    }, [container, vertical, item, windows, index]);

    return <Drag
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd} />;
}
