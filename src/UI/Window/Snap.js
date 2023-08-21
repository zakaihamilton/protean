import { useEffect, useMemo } from "react";
import Region from "../Util/Region";
import Window from "../Window";
import { useWindow } from "src/Core/Base/Window";

export function Snap() {
    const region = Region.useState();
    const windowState = Window.State.useState();
    const window = useWindow();
    const gap = 30;

    useEffect(() => {
        windowState.maximize = !!(region?.top < gap);
        windowState.snapLeft = !!(region?.left < gap);
        windowState.snapRight = !!(region?.left + region?.width > window.innerWidth - gap);
    }, [region?.left, region?.top, region?.width, window?.innerWidth, windowState]);

    return null;
}

export function useSnap() {
    const region = Region.useState();
    const window = Window.State.useState();
    const style = useMemo(() => {
        let { left, top, width, height } = region;
        if (window?.maximize) {
            left = 0;
            top = 0;
            width = "100%";
            height = "100%";
        }
        if (window.snapLeft || window.snapRight) {
            left = window.snapLeft ? 0 : "50%";
            top = 0;
            width = "50%";
            height = "100%";
        }
        return { left, top, width, height };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [region?.__counter, window]);
    return style;
}
