import { useMemo } from "react";
import Drag from "src/Core/UI/Drag";
import Container from "src/UI/Util/Container";

const PADDING = 6;

export function useItemPos({ index, vertical, wrap, inRange }) {
    const drag = Drag.usePassiveState(null);
    const region = Container.Region.useRegion();
    const regionWidth = region?.width || 0;
    const container = Container.State.useState();
    const { left, top } = drag?.rect || {};
    return useMemo(() => {
        let x = 0, y = 0;
        if (drag?.moving && inRange) {
            x = left;
            y = top;
            return [x, y, false];
        }
        let dragged = false;
        const items = container.items;
        if (!items) {
            return [x, y, false];
        }
        for (let i = 0; i < Object.keys(items).length; i++) {
            const item = items[i];
            const target = container.target;
            if (target) {
                const targetIndex = parseInt(target.dataset.index);
                const isDragging = targetIndex === index;
                if (isDragging) {
                    dragged = true;
                }
            }
            if (!item) {
                continue;
            }
            if (wrap && x + item.offsetWidth >= regionWidth) {
                x = 0;
                y += item.offsetHeight + PADDING;
            }
            if (i === index) {
                break;
            }
            if (vertical) {
                y += item.offsetHeight + PADDING;
            }
            else {
                x += item.offsetWidth + PADDING;
            }
        }
        return [x, y, dragged];
    }, [container.items, container.target, drag?.moving, inRange, index, left, top, vertical, wrap, regionWidth]);
}
