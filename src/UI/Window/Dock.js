import { useEffect, useMemo } from "react";
import Window from "../Window";
import Drag from "../../Core/UI/Drag";

function dockInBorderRegion(rect, point) {
    if (!point || !rect) {
        return null;
    }
    const snapThreshold = rect.width / 3;
    const leftBorder = rect.left + snapThreshold;
    const rightBorder = rect.left + rect.width - snapThreshold;
    const topBorder = rect.top + 32;

    if (point.x <= leftBorder && point.y <= topBorder) {
        return "left";
    } else if (point.x >= rightBorder && point.y <= topBorder) {
        return "right";
    }

    return null;
}

export function useDock() {
    const drag = Drag.useState();
    const rect = Window.Rect.useState();
    const window = Window.State.useState();

    useEffect(() => {
        const displayRegion = { left: 0, top: 0, width: globalThis.innerWidth, height: globalThis.innerHeight };
        window.dock = !window?.fixed && dockInBorderRegion(displayRegion, drag?.touch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rect?.__counter, drag?.moving, window?.dock]);
    const style = useMemo(() => {
        let { left, top, width, height } = rect;
        if (window.collapse) {
            return { left, top };
        }
        else if (window.fullscreen || window.maximize) {
            left = 0;
            top = 0;
            width = "100%";
            height = "100%";
        }
        else if (window?.dock) {
            left = window.dock === "left" ? "0%" : "50%";
            top = 0;
            width = "50%";
            height = "100%";
        } else if (window?.center) {
            left = "25%";
            top = "25%";
            width = "49.8%";
            height = "49.8%";
        }
        return { left, top, width, height };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rect?.__counter, window?.dock, window?.fullscreen, window?.center, window?.maximize, window?.collapse]);
    return style;
}
