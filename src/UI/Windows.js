import { useCallback, useEffect } from "react";
import { withState } from "src/Core/Base/State";

function Windows({ children }) {
    return children;
}

export function useWindowsItem(window, ref) {
    const windows = Windows.State.useState();

    useEffect(() => {
        if (!windows.list) {
            windows.list = [];
        }
        if (!windows.focus) {
            windows.focus = [];
        }
        windows.list.push(window);
        windows.focus.push(window);
        window.focus = true;
        return () => {
            windows.list = windows.list.filter(item => item !== window);
            windows.focus = windows.focus.filter(item => item !== window);
            window.focus = false;
        }
    }, [window, windows]);

    useEffect(() => {
        const target = ref?.current;
        if (!target || !window) {
            return;
        }
        const updateFocus = () => {
            const available = windows.focus.filter(item => !item.minimize);
            const focused = available[available.length - 1];
            windows.focus.forEach((item, index) => {
                item.focus = item === focused ? true : false;
                item.index = index;
            });
        };
        const focus = (val) => {
            if(window.minimize) {
                return;
            }
            if (val) {
                windows.focus = [...windows.focus.filter(item => item !== window), window].filter(Boolean);
            }
            updateFocus();
        };
        const minimize = (val) => {
            if(val) {
                window.focus = false;
            }
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
        }
    }, [ref, window, windows]);
}

export default withState(Windows);
