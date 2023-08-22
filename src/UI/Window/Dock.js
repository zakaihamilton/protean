import { useEffect, useMemo } from "react";
import Region from "../Util/Region";
import Window from "../Window";
import { useWindowRegion } from "src/Core/Base/Window";
import Drag from "../Util/Drag";

function dockInBorderRegion(rect, threshold, point) {
    if (!point || !rect) {
        return null;
    }
    const leftBorder = rect.left + threshold;
    const rightBorder = rect.left + rect.width - threshold;
    const topBorder = rect.top + threshold;
    const bottomBorder = rect.top + rect.height - threshold;

    if (
        point.x >= rect.left && point.x <= leftBorder && point.y >= topBorder && point.y <= bottomBorder
    ) {
        return "left";
    } else if (
        point.x <= rect.left + rect.width && point.x >= rightBorder && point.y >= topBorder && point.y <= bottomBorder
    ) {
        return "right";
    } else if (
        point.y >= rect.top && point.y <= topBorder && point.x >= leftBorder && point.x <= rightBorder
    ) {
        return "top";
    }

    return null;
}

export function Dock() {
    const region = Region.useState();
    const window = Window.State.useState();
    const displayRegion = useWindowRegion();
    const dockingThreshold = 100;
    const drag = Drag.useState();

    useEffect(() => {
        window.dock = dockInBorderRegion(displayRegion, dockingThreshold, drag?.touch);
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
            left = window.dock === "left" ? 0 : "50%";
            top = 0;
            width = "50%";
            height = "100%";
        }
        return { left, top, width, height };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [region?.__counter, window?.dock]);
    return style;
}
