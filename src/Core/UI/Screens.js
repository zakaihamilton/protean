import { useCallback, useEffect } from "react";
import { createState } from "src/Core/Base/State";
import { useEventListener } from "./EventListener";

function Screens({ children }) {
    const screens = Screens.State.useState();
    useEffect(() => {
        const available = screens.focus?.filter(item => !item.minimize && !item.close);
        let focused = available?.[available?.length - 1];
        const focusId = screens.focusId || screens.forceFocusId;
        if (focusId) {
            focused = screens.list?.find(item => item.id === focusId);
        }
        if (screens.current === focused) {
            return;
        }
        const timer = setTimeout(() => {
            screens.focus = [...screens.focus?.filter(item => item !== focused) || [], focused].filter(Boolean);
            screens.focus.forEach((item, index) => {
                const isFocused = !!(item === focused);
                item.focus = isFocused;
                item.index = index;
            });
            screens.current = focused;
        }, 0);
        return () => clearTimeout(timer);
    }, [screens, screens.focusId, screens.list]);
    return children;
}

export function useScreenItem(screen, target) {
    const screens = Screens.State.useState();

    useEffect(() => {
        if (!screen.minimize === !screen.minimized && !screen.close === !screen.closed) {
            return;
        }
        if (screen.minimize || screen.close) {
            screens.forceFocusId = null;
            screens.focusId = null;
        }
        else {
            screens.focusId = screen.id;
        }
        screen.minimized = screen.minimize;
        screen.closed = screen.close;
    }, [screen.minimize, screen.close, screen.id, screen, screens]);

    const handleMouseDown = useCallback(() => {
        screens.forceFocusId = null;
        screens.focusId = screen.id;
    }, [screen.id, screens]);

    useEventListener(target, "mousedown", handleMouseDown);

    useEffect(() => {
        if (!screen) {
            return;
        }
        if (screen.close) {
            screens.closed = [...screens.closed || [], screen];
        }
        else {
            screens.list = [...screens.list || [], screen];
            screens.focus = [...screens.focus || [], screen];
        }
        return () => {
            screens.list = screens.list?.filter(item => item !== screen);
            screens.focus = screens.focus?.filter(item => item !== screen);
            screens.closed = screens.closed?.filter(item => item !== screen);
        }
    }, [screen, screens, screen?.close]);
}

Screens.State = createState("Screens.State");

export default Screens;
