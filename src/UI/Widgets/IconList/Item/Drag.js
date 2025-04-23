import Drag from "src/Core/UI/Drag";
import Container from "src/UI/Util/Container";
import Windows from "src/Core/UI/Windows";
import { useCallback } from "react";
import { getHitTargets } from "src/Core/UI/Region";
import { moveItem } from "src/Core/Util/Array";
import IconList from "../../IconList";

export const DRAG_RANGE = 12;

export function ItemDrag({ item, inRange }) {
    const iconList = IconList.State.useState(null);
    const windows = Windows.State.useState(null);
    const container = Container.State.useState(null);
    const onDragStart = useCallback((state) => {
        state.clickable = true;
    }, []);
    const onDragMove = useCallback((state, handle) => {
        if (inRange) {
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
    }, [inRange, container]);
    const onDragEnd = useCallback((state) => {
        const hitTarget = container.target;
        container.target = null;
        if (inRange) {
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
        iconList?.onClick(item);
    }, [container, inRange, iconList, item, windows]);

    return <Drag
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd} />;
}
