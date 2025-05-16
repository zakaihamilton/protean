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
            const overflow = direction === "rtl" ? (x - item.offsetWidth < 0) : (x + item.offsetWidth >= regionWidth);
            if (wrap && overflow) {
                if (direction === "rtl") {
                    x = regionWidth - PADDING;
                }
                else {
                    x = 0;
                }
                y += item.offsetHeight + PADDING;
            }
            if (direction === "rtl") {
                x -= item.offsetWidth + PADDING;
            }
            if (i === index) {
                break;
            }
            if (vertical) {
                y += item.offsetHeight + PADDING;
            }
            else if (direction === "ltr") {
                x += item.offsetWidth + PADDING;
            }
        }
        return [x, y, dragged];
    }, [container.items, container.target, drag?.moving, direction, inRange, index, left, top, vertical, wrap, regionWidth]);
}
