import { useCallback, useEffect } from "react";
import { createState } from "src/Core/Base/State";
import { useEventListener } from "src/Core/UI/EventListener";

function ScreenManager({ children }) {
    const manager = ScreenManager.State.useState();

    useEffect(() => {
        manager(state => {
            state.open = state.list?.filter(item => !item.close);
            state.visible = state.list?.filter(item => !item.close && !item.minimize);
        });
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
            manager(state => {
                state.focus = [...state.focus?.filter(item => item !== focused) || [], focused].filter(Boolean);
                state.focus.forEach((item, index) => {
                    const isFocused = !!(item === focused);
                    item.focus = isFocused;
                    item.index = index;
                });
                state.current = focused;
            });
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
            manager(state => {
                state.forceFocusId = null;
                state.focusId = null;
            });
        }
        else {
            manager(state => {
                state.focusId = screen.id;
            });
        }
        screen(state => {
            state.minimized = state.minimize;
            state.closed = state.close;
        });
    }, [screen.minimize, screen.close, screen.id, screen, manager]);

    const handleMouseDown = useCallback(() => {
        manager(state => {
            state.forceFocusId = null;
            state.focusId = screen.id;
        });
    }, [screen.id, manager]);

    useEventListener(target, "mousedown", handleMouseDown);

    useEffect(() => {
        if (!screen) {
            return;
        }
        if (screen.close) {
            manager(state => {
                state.closed = [...state.closed || [], screen];
            });
        }
        else {
            manager(state => {
                state.list = [...state.list || [], screen];
                state.focus = [...state.focus || [], screen];
            });
        }
        return () => {
            manager(state => {
                state.list = state.list?.filter(item => item !== screen);
                state.focus = state.focus?.filter(item => item !== screen);
                state.closed = state.closed?.filter(item => item !== screen);
            });
        }
    }, [screen, manager, screen?.close]);
}

ScreenManager.State = createState("Screen.Manager.State");
ScreenManager.useManager = ScreenManager.State.useState;

export default ScreenManager;
