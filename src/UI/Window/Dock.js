import { useEffect, useMemo } from "react";
import Region from "../Util/Region";
import Window from "../Window";
import { useWindowRegion } from "src/Core/Base/Window";
import Drag from "../Util/Drag";

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
    } else if (point.y <= topBorder && point.x >= rect.left + snapThreshold && point.x <= rect.left + rect.width - snapThreshold) {
        return "top";
    }

    return null;
}

export function Dock() {
    const region = Region.useState();
    const window = Window.State.useState();
    const displayRegion = useWindowRegion();
    const drag = Drag.useState();

    useEffect(() => {
        window.dock = dockInBorderRegion(displayRegion, drag?.touch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [region?.__counter, drag?.moving, window?.dock]);

    return null;
}

export function useDock() {
    const region = Region.useState();
    const window = Window.State.useState();
    const style = useMemo(() => {
        let { left, top, width, height } = region;
        if (window?.dock === "top") {
            left = 0;
            top = 0;
            width = "100%";
            height = "100%";
        }
        else if (window?.dock) {
            left = window.dock === "left" ? "0%" : "50%";
            top = 0;
            width = "49.8%";
            height = "100%";
        }
        return { left, top, width, height };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [region?.__counter, window?.dock]);
    return style;
}
