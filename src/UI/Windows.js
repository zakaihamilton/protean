import { useCallback, useEffect } from "react";
import { createState } from "src/Core/Base/State";

function Windows({ children }) {
    const windows = Windows.State.useState();
    const updateFocus = useCallback(() => {
        const available = windows.focus?.filter(item => !item.minimize);
        let focused = available?.[available?.length - 1];
        if (windows.forceFocusId) {
            focused = windows.list?.find(item => item.id === windows.forceFocusId);
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
            if (val) {
                windows.focus = [...windows.focus.filter(item => item !== window), window].filter(Boolean);
            }
            windows.updateFocus();
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
            updateFocus();
        }
    }, [target, window, windows, enabled]);
}

Windows.State = createState("Windows.State");

export default Windows;
