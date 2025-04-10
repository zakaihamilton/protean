import { useCallback, useEffect } from "react";
import { createState } from "src/Core/Base/State";
import { useEventListener } from "./EventListener";

function Windows({ children }) {
    const windows = Windows.State.useState();
    useEffect(() => {
        const available = windows.focus?.filter(item => !item.minimize && !item.close);
        let focused = available?.[available?.length - 1];
        const focusId = windows.focusId || windows.forceFocusId;
        if (focusId) {
            focused = windows.list?.find(item => item.id === focusId);
        }
        if (windows.current === focused) {
            return;
        }
        const timer = setTimeout(() => {
            windows.focus = [...windows.focus?.filter(item => item !== focused) || [], focused].filter(Boolean);
            windows.focus.forEach((item, index) => {
                const isFocused = !!(item === focused);
                item.focus = isFocused;
                item.index = index;
            });
            windows.current = focused;
        }, 0);
        return () => clearTimeout(timer);
    }, [windows, windows.focusId, windows.list]);
    return children;
}

export function useWindowsItem(window, target) {
    const windows = Windows.State.useState();

    useEffect(() => {
        if (!window.minimize === !window.minimized && !window.close === !window.closed) {
            return;
        }
        if (window.minimize || window.close) {
            windows.forceFocusId = null;
            windows.focusId = null;
        }
        else {
            windows.focusId = window.id;
        }
        window.minimized = window.minimize;
        window.closed = window.close;
    }, [window.minimize, window.close, window.id, window, windows]);

    const handleMouseDown = useCallback(() => {
        windows.forceFocusId = null;
        windows.focusId = window.id;
    }, [window.id, windows]);

    useEventListener(target, "mousedown", handleMouseDown);

    useEffect(() => {
        if (!window) {
            return;
        }
        if (window.close) {
            windows.closed = [...windows.closed || [], window];
        }
        else {
            windows.list = [...windows.list || [], window];
            windows.focus = [...windows.focus || [], window];
        }
        return () => {
            windows.list = windows.list?.filter(item => item !== window);
            windows.focus = windows.focus?.filter(item => item !== window);
            windows.closed = windows.closed?.filter(item => item !== window);
        }
    }, [window, windows, window?.close]);
}

Windows.State = createState("Windows.State");

export default Windows;
