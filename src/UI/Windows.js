import { useEffect } from "react";
import { withState } from "src/Core/Base/State";

function Windows({ children }) {
    return children;
}

export function useWindowsItem(window, target, enabled) {
    const windows = Windows.State.useState();

    useEffect(() => {
        if (!window || !target || !enabled) {
            return;
        }
        if (!windows.list) {
            windows.list = [];
        }
        if (!windows.focus) {
            windows.focus = [];
        }
        windows.list = [...windows.list, window];
        windows.focus = [...windows.focus, window];
        const updateFocus = () => {
            const available = windows.focus.filter(item => !item.minimize);
            const focused = available[available.length - 1];
            windows.focus.forEach((item, index) => {
                const isFocused = !!(item === focused);
                item.focus = isFocused;
                item.index = index;
            });
            windows.focus = [...windows.focus.filter(item => item !== focused), focused].filter(Boolean);
        };
        const focus = (val) => {
            if (window.minimize) {
                return;
            }
            if (val) {
                windows.focus = [...windows.focus.filter(item => item !== window), window].filter(Boolean);
            }
            updateFocus();
        };
        const minimize = (val) => {
            if (val) {
                window.focus = false;
            }
            updateFocus();
        };
        window.__monitor("focus", focus);
        window.__monitor("minimize", minimize);
        updateFocus();
        const handleMouseDown = () => {
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

export default withState(Windows);
