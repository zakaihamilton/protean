import { useCallback, useEffect } from "react";
import { withState } from "src/Core/Base/State";

function Windows({ children }) {
    return children;
}

export function useWindowsItem(window, ref) {
    const windows = Windows.State.useState();

    const moveFocusTo = useCallback((target) => {
        if (!target) {
            target = windows.focus[windows.focus.length - 1];
        }
        windows.focus = [...windows.focus.filter(item => item !== target), target].filter(Boolean);
        windows.focus.forEach((item, index) => {
            item.focus = item === target;
            item.index = index;
        });
    }, [windows]);

    useEffect(() => {
        if (!windows.list) {
            windows.list = [];
        }
        if (!windows.focus) {
            windows.focus = [];
        }
        windows.list.push(window);
        moveFocusTo(window);
        return () => {
            windows.list = windows.list.filter(item => item !== window);
            windows.focus = windows.focus.filter(item => item !== window);
            moveFocusTo(null);
        }
    }, [window, windows, moveFocusTo]);

    useEffect(() => {
        const target = ref?.current;
        if (!target || !window) {
            return;
        }
        window.setFocus = () => {
            window.minimize = false;
            moveFocusTo(window);
        };
        window.setMinimize = () => {
            window.minimize = true;
            window.focus = false;
            windows.focus = windows.focus.filter(item => item !== window);
            moveFocusTo(null);
        }
        const handleMouseDown = () => {
            window.setFocus();
        };
        target.addEventListener("mousedown", handleMouseDown);
        return () => {
            target.removeEventListener("mousedown", handleMouseDown);
        }
    }, [moveFocusTo, ref, window, windows]);
}

export default withState(Windows);
