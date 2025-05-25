import { useMemo } from "react";
import Drag from "src/Core/UI/Drag";
import Container from "src/UI/Util/Container";

const PADDING = 6;

export function useItemPos({ index, vertical, wrap, inRange, direction }) {
    const drag = Drag.usePassiveState(null);
    const region = Container.Region.useRegion();
    const regionWidth = region?.width || 0;
    const container = Container.State.useState();
    const { left, top } = drag?.rect || {};
    return useMemo(() => {
        let x = direction === "rtl" ? regionWidth - PADDING : 0, y = 0;
        if (drag?.moving && inRange) {
            x = left;
            y = top;
            return [x, y, false];
        }
        let dragged = false;
        const items = container.items;
        if (!items || container.sizeCounter < 0) {
            return [x, y, false];
        }
        for (let i = 0; i < items.length; i++) {
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
            const { width, height } = item.getBoundingClientRect();
            const overflow = direction === "rtl" ? (x - width < 0) : (x + width >= regionWidth);
            if (wrap && overflow) {
                if (direction === "rtl") {
                    x = regionWidth - PADDING;
                }
                else {
                    x = 0;
                }
                y += height + PADDING;
            }
            if (direction === "rtl") {
                x -= width + PADDING;
            }
            if (i === index) {
                break;
            }
            if (vertical) {
                y += height + PADDING;
            }
            else if (direction === "ltr") {
                x += width + PADDING;
            }
        }
        return [x, y, dragged];
    }, [container.items, container.sizeCounter, container.target, drag?.moving, direction, inRange, index, left, top, vertical, wrap, regionWidth]);
}
