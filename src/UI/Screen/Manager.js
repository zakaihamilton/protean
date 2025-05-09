import { useCallback, useEffect } from "react";
import { createState } from "src/Core/Base/State";
import { useEventListener } from "src/Core/UI/EventListener";

function ScreenManager({ children }) {
    const manager = ScreenManager.State.useState();

    useEffect(() => {
        manager.open = manager.list?.filter(item => !item.close);
        manager.visible = manager.list?.filter(item => !item.close && !item.minimize);
    }, [manager, manager.list]);

    useEffect(() => {
        const available = manager.focus?.filter(item => !item.minimize && !item.close);
        let focused = available?.[available?.length - 1];
        const focusId = manager.focusId || manager.forceFocusId;
        if (focusId) {
            focused = manager.list?.find(item => item.id === focusId);
        }
        if (manager.current === focused) {
            return;
        }
        const timer = setTimeout(() => {
            manager.focus = [...manager.focus?.filter(item => item !== focused) || [], focused].filter(Boolean);
            manager.focus.forEach((item, index) => {
                const isFocused = !!(item === focused);
                item.focus = isFocused;
                item.index = index;
            });
            manager.current = focused;
        }, 0);
        return () => clearTimeout(timer);
    }, [manager, manager.focusId, manager.list]);
    return children;
}

export function useScreenItem(screen, target) {
    const manager = ScreenManager.State.useState();

    useEffect(() => {
        if (!screen.minimize === !screen.minimized && !screen.close === !screen.closed) {
            return;
        }
        if (screen.minimize || screen.close) {
            manager.forceFocusId = null;
            manager.focusId = null;
        }
        else {
            manager.focusId = screen.id;
        }
        screen.minimized = screen.minimize;
        screen.closed = screen.close;
    }, [screen.minimize, screen.close, screen.id, screen, manager]);

    const handleMouseDown = useCallback(() => {
        manager.forceFocusId = null;
        manager.focusId = screen.id;
    }, [screen.id, manager]);

    useEventListener(target, "mousedown", handleMouseDown);

    useEffect(() => {
        if (!screen) {
            return;
        }
        if (screen.close) {
            manager.closed = [...manager.closed || [], screen];
        }
        else {
            manager.list = [...manager.list || [], screen];
            manager.focus = [...manager.focus || [], screen];
        }
        return () => {
            manager.list = manager.list?.filter(item => item !== screen);
            manager.focus = manager.focus?.filter(item => item !== screen);
            manager.closed = manager.closed?.filter(item => item !== screen);
        }
    }, [screen, manager, screen?.close]);
}

ScreenManager.State = createState("Screen.Manager.State");
ScreenManager.useManager = ScreenManager.State.useState;

export default ScreenManager;
