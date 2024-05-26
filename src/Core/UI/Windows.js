import { useCallback, useEffect } from "react";
import { createState } from "src/Core/Base/State";

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

export function useWindowsItem(window, target, enabled) {
    const windows = Windows.State.useState();

    useEffect(() => {
        if (!window || !target || !enabled) {
            return;
        }
        windows.list = [...windows.list || [], window];
        windows.focus = [...windows.focus || [], window];
        const focus = (val) => {
            if (window.minimize) {
                return;
            }
            windows.updateFocus(val ? window.id : undefined);
        };
        const minimize = (val) => {
            if (val) {
                windows.forceFocusId = null;
                window.focus = false;
            }
            windows.updateFocus();
        };
        window.__monitor("focus", focus);
        window.__monitor("minimize", minimize);
        windows.updateFocus();
        const handleMouseDown = () => {
            windows.forceFocusId = null;
            window.focus = true;
        };
        target.addEventListener("mousedown", handleMouseDown);
        return () => {
            window.__unmonitor("focus", focus);
            window.__unmonitor("minimize", minimize);
            target.removeEventListener("mousedown", handleMouseDown);
            windows.list = windows.list.filter(item => item !== window);
            windows.focus = windows.focus.filter(item => item !== window);
            windows.updateFocus();
        }
    }, [target, window, windows, enabled]);
}

Windows.State = createState("Windows.State");

export default Windows;
