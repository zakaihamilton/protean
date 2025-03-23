import { useCallback, useEffect } from "react";
import { createState } from "src/Core/Base/State";
import { useEventListener } from "./EventListener";

function Windows({ children }) {
    const windows = Windows.State.useState();
    const updateFocus = useCallback((focusId) => {
        const available = windows.focus?.filter(item => !item.minimize);
        let focused = available?.[available?.length - 1];
        focusId = focusId || windows.forceFocusId;
        if (focusId) {
            focused = windows.list?.find(item => item.id === focusId);
        }
        windows.focus = [...windows.focus?.filter(item => item !== focused) || [], focused].filter(Boolean);
        windows.focus.forEach((item, index) => {
            const isFocused = !!(item === focused);
            item.focus = isFocused;
            item.index = index;
        });
        windows.current = focused;
    }, [windows]);
    return <>
        <Windows.State updateFocus={updateFocus} />
        {children}
    </>;
}

export function useWindowsItem(window, target) {
    const windows = Windows.State.useState();

    useEffect(() => {
        if (window.minimize) {
            windows.forceFocusId = null;
            windows.updateFocus();
        }
        else {
            windows.updateFocus(window.id);
        }
    }, [window.minimize, window.id, windows]);

    const handleMouseDown = useCallback(() => {
        windows.forceFocusId = null;
        if (windows.current?.id !== window.id) {
            windows.updateFocus(window.id);
        }
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
        windows.updateFocus();
        return () => {
            windows.list = windows.list?.filter(item => item !== window);
            windows.focus = windows.focus?.filter(item => item !== window);
            windows.closed = windows.closed?.filter(item => item !== window);
            windows.updateFocus();
        }
    }, [window, windows, window?.close]);
}

Windows.State = createState("Windows.State");

export default Windows;
