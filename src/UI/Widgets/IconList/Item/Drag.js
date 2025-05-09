import Drag from "src/Core/UI/Drag";
import Container from "src/UI/Util/Container";
import { useCallback } from "react";
import { getHitTargets } from "src/Core/UI/Region";
import { moveItem } from "src/Core/Util/Array";
import IconList from "../../IconList";
import Screen from "src/UI/Screen";

export const DRAG_RANGE = 12;

export function ItemDrag({ item, inRange }) {
    const iconList = IconList.State.useState(null);
    const screenManager = Screen.Manager.useManager(null);
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
                    const sourceIndex = screenManager.list.findIndex(elem => elem.id === item.id);
                    const targetIndex = screenManager.list.findIndex(elem => elem.id === targetId);
                    if (targetIndex !== -1) {
                        screenManager.list = moveItem(screenManager.list, sourceIndex, targetIndex, item);
                    }
                }
            }
            return;
        }
        if (!state.clickable) {
            return;
        }
        iconList?.onClick(item);
    }, [container, inRange, iconList, item, screenManager]);

    return <Drag
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd} />;
}
