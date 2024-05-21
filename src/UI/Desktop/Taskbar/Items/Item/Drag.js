import Drag from "src/Core/UI/Drag";
import Container from "src/UI/Util/Container";
import Windows from "src/UI/Windows";
import { useCallback } from "react";
import { getHitTargets } from "src/Core/UI/Region";
import { moveItem } from "src/Core/Base/Array";

export const DRAG_RANGE = 12;

export function ItemDrag({ item, index, vertical }) {
    const windows = Windows.State.useState({ selector: null });
    const container = Container.State.useState();
    const onDragStart = useCallback((state) => {
        state.clickable = true;
    }, []);
    const onDragMove = useCallback((state, handle) => {
        if (vertical ? Math.abs(state.dragged?.y) > DRAG_RANGE : Math.abs(state.dragged?.x) > DRAG_RANGE) {
            const hitTargets = getHitTargets(container.element, handle);
            const hitTarget = hitTargets?.[hitTargets?.length - 1];
            if (hitTarget) {
                container.target = hitTarget;
            }
            state.clickable = false;
        }
        else {
            container.target = null;
        }
    }, [container, vertical]);
    const onDragEnd = useCallback((state) => {
        const hitTarget = container.target;
        container.target = null;
        if (vertical ? Math.abs(state.dragged?.y) > DRAG_RANGE : Math.abs(state.dragged?.x) > DRAG_RANGE) {
            if (hitTarget) {
                const targetId = hitTarget.dataset.id;
                if (targetId) {
                    const sourceIndex = windows.list.findIndex(elem => elem.id === item.id);
                    const targetIndex = windows.list.findIndex(elem => elem.id === targetId);
                    if (targetIndex !== -1) {
                        windows.list = moveItem(windows.list, sourceIndex, targetIndex, item);
                    }
                }
            }
            return;
        }
        if (!state.clickable) {
            return;
        }
        windows.forceFocusId = null;
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
