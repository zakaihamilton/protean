import { useEffect, useMemo } from "react";
import Drag from "src/Core/UI/Drag";
import Container from "src/UI/Util/Container";

const PADDING = 6;

export function useItemPos({ index, vertical, inRange }) {
    const drag = Drag.usePassiveState(null);
    const container = Container.State.useState();
    const { left, top } = drag?.rect || {};
    return useMemo(() => {
        let x = 0, y = 0, styles = {};
        if (drag?.moving && inRange) {
            x = left;
            y = top;
        }
        else {
            const items = container.items;
            if (!items) {
                return [x, y, styles];
            }
            for (let i = 0; i < Object.keys(items).length; i++) {
                const item = items[i];
                const target = container.target;
                if (target) {
                    const targetIndex = parseInt(target.dataset.index);
                    const isDragging = targetIndex === index;
                    if (isDragging) {
                        styles.opacity = "0.5";
                    }
                }
                else {
                    styles = "";
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
        }
        return [x, y, styles];
    }, [container.items, container.target, drag?.moving, inRange, index, left, top, vertical]);
}
