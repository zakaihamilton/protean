import { useEffect, useMemo } from "react";
import Drag from "src/Core/UI/Drag";
import Container from "src/UI/Util/Container";

const PADDING = 6;

export function useItemPos({ index, vertical, ref }) {
    const drag = Drag.usePassiveState(null);
    const container = Container.State.useState();
    const element = ref.current;
    const { left, top } = drag?.rect || {};
    useEffect(() => {
        if (element) {
            const sizes = Object.assign({}, container.sizes);
            if (vertical) {
                sizes[index] = element.offsetHeight;
            }
            else {
                sizes[index] = element.offsetWidth;
            }
            container.sizes = sizes;
        }
    }, [container, element, index, vertical]);
    return useMemo(() => {
        let x = 0, y = 0;
        if (drag?.moving) {
            x = left;
            y = top;
        }
        else {
            const sizes = container.sizes;
            if (!sizes) {
                return [x, y];
            }
            for (let i = 0; i < Object.keys(sizes).length; i++) {
                const size = sizes[i];
                if (i === index) {
                    break;
                }
                if (container.target) {
                    const targetIndex = container.target.dataset.index;
                    const isDragging = parseInt(targetIndex) === i;
                    if (isDragging) {
                        console.log("dragging", container.target.dataset.label);
                        if (vertical) {

                        }
                        else {

                        }
                    }
                }
                if (vertical) {
                    y += size + PADDING;
                }
                else {
                    x += size + PADDING;
                }
            }
        }
        return [x, y];
    }, [container.sizes, container.target, drag?.moving, index, left, top, vertical]);
}
